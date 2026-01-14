import { Module } from '@nestjs/common';
import { ArticlesController } from './presentation/controllers/articles.controller';
import { ArticleService } from './application/services/article.service';
import { ARTICLE_REPOSITORY } from './domain/repositories/prisma-article.repository.interface';
import { PrismaArticleRepository } from './infrastructure/repositories/prisma.repository';
import { SlugGenerator } from 'src/common/utils/slug-generator.util';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticlesController],
  providers: [
    ArticleService,
    {
      provide: ARTICLE_REPOSITORY,
      useClass: PrismaArticleRepository,
    },
    SlugGenerator,
  ],
  exports: [ArticleService],
})
export class ArticlesModules {}
