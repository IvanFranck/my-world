import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TagEntity } from '../entities/tag.entity';
import { Tag } from 'generated/prisma/client';

@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tag: TagEntity): Promise<TagEntity> {
    const data = await this.prisma.tag.create({
      data: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      },
    });

    return this.mapToDomain(data);
  }

  async findAll(): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    return tags.map((t) => this.mapToDomain(t));
  }

  async findById(id: string): Promise<TagEntity | null> {
    const data = await this.prisma.tag.findUnique({
      where: { id },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async findBySlug(slug: string): Promise<TagEntity | null> {
    const data = await this.prisma.tag.findUnique({
      where: { slug },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async update(id: string, updates: Partial<TagEntity>): Promise<TagEntity> {
    const data = await this.prisma.tag.update({
      where: { id },
      data: updates,
    });

    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: {
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  async findAllWithArticleCount(): Promise<
    Array<TagEntity & { articleCount: number }>
  > {
    const tags = await this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return tags.map((t) => ({
      ...this.mapToDomain(t),
      articleCount: t._count.articles,
    }));
  }

  /**
   * Rechercher des tags par nom (autocomplete)
   */
  async search(query: string, limit: number = 10): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
      take: limit,
    });

    return tags.map((t) => this.mapToDomain(t));
  }

  /**
   * Tags populaires (les plus utilisés)
   */
  async findPopular(
    limit: number = 10,
  ): Promise<Array<TagEntity & { articleCount: number }>> {
    const tags = await this.prisma.tag.findMany({
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: limit,
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return tags.map((t) => ({
      ...this.mapToDomain(t),
      articleCount: t._count.articles,
    }));
  }

  private mapToDomain(data: Tag): TagEntity {
    return new TagEntity(
      data.id,
      data.name,
      data.slug,
      data.createdAt,
      data.updatedAt,
    );
  }
}
