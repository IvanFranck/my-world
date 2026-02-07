import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { SlugGenerator } from '../common/utils/slug-generator.util';
import { DatabaseModule } from 'src/database/database.module';
import { TagsRepository } from './repositories/tags.reposiory';

@Module({
  imports: [DatabaseModule],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository, SlugGenerator],
  exports: [TagsService],
})
export class TagsModule {}
