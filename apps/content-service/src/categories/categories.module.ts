// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { SlugGenerator } from '../common/utils/slug-generator.util';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, SlugGenerator],
  exports: [CategoriesService],
})
export class CategoriesModule {}
