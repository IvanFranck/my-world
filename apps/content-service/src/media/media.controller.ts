import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Upload un seul fichier
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-user-id') userId: string,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.mediaService.uploadFile(file as UploadFile, userId, folder);
  }

  /**
   * Upload plusieurs fichiers
   */
  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 fichiers
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('x-user-id') userId: string,
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return this.mediaService.uploadMultipleFiles(
      files as UploadFile[],
      userId,
      folder,
    );
  }

  /**
   * Lister tous les médias
   */
  @Get()
  async findAll(@Headers('x-user-id') userId?: string) {
    return this.mediaService.findAll(userId);
  }

  /**
   * Trouver un média par ID
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.mediaService.findById(id);
  }

  /**
   * Supprimer un média
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') userRole: string,
  ) {
    await this.mediaService.delete(id, userId, userRole);
  }
}
