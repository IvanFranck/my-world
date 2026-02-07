import { ArticleStatusRequest } from '@my-website/types';
import { Injectable } from '@nestjs/common';
import { Article, Prisma } from 'generated/prisma/client';
import { ArticleEntity } from 'src/articles/domain/entities/article.entity';
import {
  ArticleFilters,
  IArticleRepository,
  PaginatedResult,
  PaginationParams,
} from 'src/articles/domain/repositories/prisma-article.repository.interface';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PrismaArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    article: ArticleEntity,
    categoryIds: string[],
    tagIds: string[],
  ): Promise<ArticleEntity> {
    const data = await this.prisma.article.create({
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        status: article.status,
        authorId: article.authorId,
        publishedAt: article.publishedAt,
        scheduledAt: article.scheduledAt,
        views: article.views,
        categories: {
          connect: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
        tags: {
          connect: tagIds.map((tagId) => ({ id: tagId })),
        },
      },
      include: {
        categories: true,
        tags: true,
      },
    });

    return this.mapToDomain(data);
  }

  async findById(id: string): Promise<ArticleEntity | null> {
    const data = await this.prisma.article.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async findBySlug(slug: string): Promise<ArticleEntity | null> {
    const data = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        categories: true,
        tags: true,
      },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async findAll(
    filters: ArticleFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ArticleEntity>> {
    const whereClause = this.buildWhereClause(filters);
    const orderByClause = this.buildOrderByClause(pagination);

    const [articles, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where: whereClause,
        include: {
          categories: true,
          tags: true,
        },
        orderBy: orderByClause,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      this.prisma.article.count(),
    ]);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data: articles.map((article) => this.mapToDomain(article)),
      meta: {
        limit: pagination.limit,
        page: pagination.page,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1,
      },
    };
  }

  async update(
    id: string,
    updates: Partial<Omit<ArticleEntity, 'createdAt' | 'updatedAt'>>,
    categoryIds?: string[],
    tagIds?: string[],
  ): Promise<ArticleEntity> {
    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...updates,
        ...(categoryIds
          ? {
              categories: {
                set: categoryIds.map((id) => ({ id })),
              },
            }
          : undefined),
        ...(tagIds
          ? {
              tags: {
                set: tagIds.map((id) => ({ id })),
              },
            }
          : undefined),
      },
      include: {
        categories: true,
        tags: true,
      },
    });

    return this.mapToDomain(article);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({ where: { id } });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.article.count({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  async increaseViews(id: string): Promise<void> {
    await this.prisma.article.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async findRecent(limit: number): Promise<ArticleEntity[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatusRequest.PUBLISHED,
        publishedAt: {
          lte: new Date(),
        },
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        categories: true,
        tags: true,
      },
    });

    return articles.map((a) => this.mapToDomain(a));
  }

  async findPopular(limit: number): Promise<ArticleEntity[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      include: {
        categories: true,
        tags: true,
      },
      orderBy: { views: 'desc' },
      take: limit,
    });

    return articles.map((a) => this.mapToDomain(a));
  }

  /**
   * Build prisma article "where" clause
   * @param filters : article filters
   * @returns prisma article "where" clause
   */
  private buildWhereClause(filters: ArticleFilters): Prisma.ArticleWhereInput {
    const where: Prisma.ArticleWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.categoryId) {
      where.categories = {
        some: { id: filters.categoryId },
      };
    }

    if (filters.tagId) {
      where.tags = {
        some: { id: filters.tagId },
      };
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * Build Prisma article "order by" clause
   * @param pagination : pagination params
   * @returns prisma article "order by" clause
   */
  private buildOrderByClause(
    pagination: PaginationParams,
  ): Prisma.ArticleOrderByWithRelationInput {
    const sortBy = pagination.sortBy || 'publishedAt';
    const sortOrder = pagination.sortOrder || 'desc';

    return { [sortBy]: sortOrder };
  }

  /**
   * Map prisma article article to article domain entity
   * @param data Prisma Article model
   * @returns mapped prisma article to our domain entity
   */
  private mapToDomain(data: Article): ArticleEntity {
    return new ArticleEntity(
      data.id,
      data.title,
      data.content,
      data.slug,
      data.status,
      data.authorId,
      data.excerpt,
      data.coverImage,
      data.metaTitle,
      data.metaDescription,
      data.publishedAt,
      data.scheduledAt,
      data.views,
      data.createdAt,
      data.updatedAt,
    );
  }
}
