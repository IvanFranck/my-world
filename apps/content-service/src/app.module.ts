import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import Joi from 'joi';
import { ArticlesModules } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3002),
        R2_ACCOUNT_ID: Joi.string().required(),
        R2_ACCESS_KEY_ID: Joi.string().required(),
        R2_SECRET_ACCESS_KEY: Joi.string().required(),
        R2_BUCKET_NAME: Joi.string().required(),
        R2_PUBLIC_URL: Joi.string().required(),
        R2_API_ENDPOINT: Joi.string().required(),
        R2_REGION: Joi.string().default('auto'),
        UPLOAD_ALLOWED_MIME_TYPES: Joi.string().required(),
        UPLOAD_MAX_FILE_SIZE: Joi.number().default(10485760), // 10 MB par défaut
      }),
    }),
    DatabaseModule,
    ArticlesModules,
    CategoriesModule,
    TagsModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
