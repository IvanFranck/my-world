import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ARTICLE_REPOSITORY,
  type IArticleRepository,
} from 'src/articles/domain/repositories/prisma-article.repository.interface';
import { SlugGenerator } from 'src/common/utils/slug-generator.util';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { ArticleEntity } from 'src/articles/domain/entities/article.entity';
import { v4 as uuid } from 'uuid';
import { ArticleFiltersDto } from '../dtos/article-filters.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleEntity.name);
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: IArticleRepository,
    private readonly slugGenerator: SlugGenerator,
  ) {}
  async create(
    dto: CreateArticleDto,
    authorId: string,
  ): Promise<ArticleEntity> {
    const slug: string = dto.slug || this.slugGenerator.generate(dto.title);

    const slugExists = await this.articleRepository.slugExists(slug);
    if (slugExists) {
      throw new ConflictException(
        `Article with this slug ${slug} already exists`,
      );
    }
    const id: string = (uuid as () => string)();
    const article = new ArticleEntity(
      id,
      dto.title,
      dto.content,
      slug,
      dto.status,
      authorId,
      dto.excerpt || null,
      dto.coverImage || null,
      dto.metaTitle || null,
      dto.metaDescription || null,
      null, // publishedAt,
      dto.scheduledAt || null,
      0,
      null, // createdAt
      null, // updatedAt
    );

    article.generateExcerpt();

    if (dto.status === 'PUBLISHED') {
      article.publish();
    }

    return this.articleRepository.create(article, dto.categoryIds, dto.tagIds);
  }

  async findAll(filters: ArticleFiltersDto) {
    return await this.articleRepository.findAll(
      {
        status: filters.status,
        categoryId: filters.categoryId,
        tagId: filters.tagId,
        search: filters.search,
        authorId: filters.authorId,
      },
      {
        page: filters.page || 1,
        limit: filters.limit || 10,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      },
    );
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findBySlug(slug);

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    this.articleRepository.increaseViews(article.id).catch(() => {
      this.logger.error(
        `[findbyslug] error: error while increment article with slug "${slug}" views`,
      );
    });

    return article;
  }

  async findById(id: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findById(id);

    if (!article) {
      throw new NotFoundException(`Article with id "${id}" not found`);
    }

    return article;
  }

  async update(id: string, dto: UpdateArticleDto): Promise<ArticleEntity> {
    const article = await this.findById(id);

    if (dto.slug && dto.slug !== article.slug) {
      const slugExists = await this.articleRepository.slugExists(dto.slug, id);
      if (slugExists) {
        throw new ConflictException(
          `Article with this slug ${dto.slug} already exists`,
        );
      }
    }

    return await this.articleRepository.update(
      id,
      dto,
      dto.categoryIds,
      dto.tagIds,
    );
  }

  async delete(id: string) {
    await this.articleRepository.delete(id);
  }

  async publish(id: string): Promise<ArticleEntity> {
    const article = await this.findById(id);

    article.publish();

    return this.articleRepository.update(id, article);
  }

  async archive(id: string): Promise<ArticleEntity> {
    const article = await this.findById(id);

    article.archive();

    return this.articleRepository.update(id, article);
  }

  async findPopular(limit: number = 10): Promise<ArticleEntity[]> {
    return this.articleRepository.findPopular(limit);
  }

  async findRecent(limit: number = 10): Promise<ArticleEntity[]> {
    return this.articleRepository.findRecent(limit);
  }
}
