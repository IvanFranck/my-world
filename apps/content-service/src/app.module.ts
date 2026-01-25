import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import Joi from 'joi';
import { ArticlesModules } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3002),
      }),
    }),
    DatabaseModule,
    ArticlesModules,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
