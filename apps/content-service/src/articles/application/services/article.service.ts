import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  ARTICLE_REPOSITORY,
  type IArticleRepository,
} from 'src/articles/domain/repositories/prisma-article.repository.interface';
import { SlugGenerator } from 'src/common/utils/slug-generator.util';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { ArticleEntity } from 'src/articles/domain/entities/article.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArticleService {
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
      throw new ConflictException(`Article with this slug ${slug} exists`);
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
}
