import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { MediaRepository } from './repositories/media.repository';
import { MediaEntity } from './entities/media.entity';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import sharp, { type Sharp } from 'sharp';

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly allowedMimeTypes: string[];
  private readonly maxFileSize: number;

  constructor(
    private readonly repository: MediaRepository,
    private readonly configService: ConfigService,
  ) {
    const region = this.configService.getOrThrow<string>('R2_REGION');
    const accessKeyId =
      this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    const url = this.configService.getOrThrow<string>('R2_PUBLIC_URL');
    const r2ApiEndpoint =
      this.configService.getOrThrow<string>('R2_API_ENDPOINT');
    const bucket = this.configService.getOrThrow<string>('R2_BUCKET_NAME');
    const allowedMimeTypesString = this.configService.getOrThrow<string>(
      'UPLOAD_ALLOWED_MIME_TYPES',
    );
    const allowedMimeTypes = allowedMimeTypesString
      ?.split(',')
      .map((type) => type.trim());
    const maxFileSize = this.configService.getOrThrow<number>(
      'UPLOAD_MAX_FILE_SIZE',
    );

    if (
      !region ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucket ||
      !allowedMimeTypes ||
      !url ||
      maxFileSize === undefined
    ) {
      throw new Error('Missing required AWS or upload configuration');
    }

    this.s3Client = new S3Client({
      region,
      endpoint: r2ApiEndpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucket = bucket;
    this.allowedMimeTypes = allowedMimeTypes;
    this.maxFileSize = maxFileSize;
    this.publicUrl = url;
  }

  /**
   * Uploader un fichier vers S3
   */
  async uploadFile(
    file: UploadFile,
    userId: string,
    folder: string = 'uploads',
  ): Promise<MediaEntity> {
    // Validation
    this.validateFile(file);

    // Générer un nom de fichier unique
    const ext = path.extname(file.originalname);
    const filename = `${uuid()}${ext}`;
    const key = `${folder}/${filename}`;

    try {
      // Optimiser l'image si c'est une image
      let buffer = file.buffer;
      if (this.isImage(file.mimetype)) {
        buffer = await this.optimizeImage(file.buffer, file.mimetype);
      }

      // Upload vers R2
      const commandInput: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
        // Note: R2 ne supporte pas ACL, utiliser Public Access à la place
      };
      const command = new PutObjectCommand(commandInput);

      await this.s3Client.send(command);

      // URL du fichier
      const url = `${this.publicUrl}/${key}`;

      // Créer l'entité Media
      const media = new MediaEntity(
        uuid(),
        filename,
        file.originalname,
        file.mimetype,
        buffer.length,
        url,
        userId,
        this.bucket,
        key,
      );

      // Sauvegarder en DB
      return this.repository.create(media);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to upload file: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Uploader plusieurs fichiers
   */
  async uploadMultipleFiles(
    files: UploadFile[],
    userId: string,
    folder: string = 'uploads',
  ): Promise<MediaEntity[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, userId, folder),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Trouver tous les médias d'un utilisateur
   */
  async findAll(userId?: string): Promise<MediaEntity[]> {
    return this.repository.findAll(userId);
  }

  /**
   * Trouver un média par ID
   */
  async findById(id: string): Promise<MediaEntity> {
    const media = await this.repository.findById(id);

    if (!media) {
      throw new NotFoundException(`Media with id "${id}" not found`);
    }

    return media;
  }

  /**
   * Supprimer un média
   */
  async delete(id: string, userId: string, userRole: string): Promise<void> {
    const media = await this.findById(id);

    // Vérifier les permissions
    if (media.uploadedBy !== userId && userRole !== 'ADMIN') {
      throw new BadRequestException('You cannot delete this file');
    }

    try {
      // Supprimer de S3
      if (media.key) {
        const command = new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: media.key,
        });

        await this.s3Client.send(command);
      }

      // Supprimer de la DB
      await this.repository.delete(id);

      this.logger.log(`Media ${id} deleted successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to delete media: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to delete file');
    }
  }

  /**
   * Valider le fichier
   */
  private validateFile(file: UploadFile): void {
    // Vérifier la taille
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Vérifier le type MIME
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Vérifier si c'est une image
   */
  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Optimiser une image
   */
  private async optimizeImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<Buffer> {
    try {
      let image: Sharp = sharp(buffer);

      // Obtenir les métadonnées
      const metadata = await image.metadata();

      // Redimensionner si trop grand (max 2000px de largeur)
      if (metadata.width && metadata.width > 2000) {
        image = image.resize(2000, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      // Compresser selon le format
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        image = image.jpeg({ quality: 85, progressive: true });
      } else if (mimeType === 'image/png') {
        image = image.png({ quality: 85, compressionLevel: 9 });
      } else if (mimeType === 'image/webp') {
        image = image.webp({ quality: 85 });
      }

      return await image.toBuffer();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to optimize image: ${errorMessage}`);
      // Si l'optimisation échoue, retourner le buffer original
      return buffer;
    }
  }
}
