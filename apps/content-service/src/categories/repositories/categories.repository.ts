import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CategoryEntity } from '../entities/categories.entity';
import { Category } from 'generated/prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const data = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
      },
    });

    return this.mapToDomain(data);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((c) => this.mapToDomain(c));
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const data = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const data = await this.prisma.category.findUnique({
      where: { slug },
    });

    return data ? this.mapToDomain(data) : null;
  }

  async update(
    id: string,
    updates: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    const data = await this.prisma.category.update({
      where: { id },
      data: updates,
    });

    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: {
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return count > 0;
  }

  /**
   * Catégories avec nombre d'articles
   */
  async findAllWithArticleCount(): Promise<
    Array<CategoryEntity & { articleCount: number }>
  > {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((c) => {
      const entity = this.mapToDomain(c);
      return Object.assign(entity, { articleCount: c._count.articles });
    });
  }

  private mapToDomain(data: Category): CategoryEntity {
    return new CategoryEntity(
      data.id,
      data.name,
      data.slug,
      data.description,
      data.color,
    );
  }
}
