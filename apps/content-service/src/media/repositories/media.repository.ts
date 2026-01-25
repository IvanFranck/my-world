// src/media/repositories/media.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MediaEntity } from '../entities/media.entity';
import { Media } from 'generated/prisma/client';

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(media: MediaEntity): Promise<MediaEntity> {
    const data = await this.prisma.media.create({
      data: {
        id: media.id,
        filename: media.filename,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: media.size,
        url: media.url,
        bucket: media.bucket,
        key: media.key,
        uploadedBy: media.uploadedBy,
      },
    });

    return this.mapToDomain(data);
  }

  async findAll(userId?: string): Promise<MediaEntity[]> {
    const medias = await this.prisma.media.findMany({
      where: userId ? { uploadedBy: userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return medias.map((m) => this.mapToDomain(m));
  }

  async findById(id: string): Promise<MediaEntity | null> {
    const data = await this.prisma.media.findUnique({
      where: { id },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.media.delete({ where: { id } });
  }

  async findByUserId(userId: string, limit?: number): Promise<MediaEntity[]> {
    const medias = await this.prisma.media.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
    });

    return medias.map((m) => this.mapToDomain(m));
  }

  private mapToDomain(data: Media): MediaEntity {
    return new MediaEntity(
      data.id,
      data.filename,
      data.originalName,
      data.mimeType,
      data.size,
      data.url,
      data.uploadedBy,
      data.bucket,
      data.key,
      data.createdAt,
      data.updatedAt,
    );
  }
}
