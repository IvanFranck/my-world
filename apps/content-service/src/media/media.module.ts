// src/media/media.module.ts
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './repositories/media.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {}
