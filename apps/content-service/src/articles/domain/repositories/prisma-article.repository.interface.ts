import { ArticleStatus } from 'generated/prisma/enums';
import { ArticleEntity } from '../entities/article.entity';

export interface ArticleFilters {
  status?: ArticleStatus;
  categoryId?: string;
  tagId?: string;
  search?: string;
  authorId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Repository interface Article
 * Persistence abstraction
 */

export interface IArticleRepository {
  /**
   * create an article
   */
  create(
    article: ArticleEntity,
    categoryIds: string[],
    tagIds: string[],
  ): Promise<ArticleEntity>;

  /**
   * Find an article by ID
   */
  findById(id: string): Promise<ArticleEntity | null>;

  /**
   * Find an article by slug
   */
  findBySlug(slug: string): Promise<ArticleEntity | null>;

  /**
   * Find all articles with filters and pagination
   */
  findAll(
    filters: ArticleFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ArticleEntity>>;

  /**
   * Update an article
   */
  update(
    id: string,
    updates: Partial<Omit<ArticleEntity, 'createdAt' | 'updatedAt'>>,
    categoryIds?: string[],
    tagIds?: string[],
  ): Promise<ArticleEntity>;

  /**
   * delete an article
   */
  delete(id: string): Promise<void>;

  /**
   * Check wheter slug exist
   */
  slugExists(slug: string, excludeId?: string): Promise<boolean>;

  /**
   * Increase article views
   */
  increaseViews(id: string): Promise<void>;

  /**
   * find popular articles
   */
  findPopular(limit: number): Promise<ArticleEntity[]>;

  /**
   * find recent articles
   */
  findRecent(limit: number): Promise<ArticleEntity[]>;
}

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
