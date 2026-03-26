import { Module } from '@nestjs/common';
import { AuthRoutesController } from './auth-routes.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ArticlesRoutesController } from './articles-routes.controller';
import { CategoriesRoutesController } from './categories-routes.controller';
import { TagsRoutesController } from './tags-routes.controller';

@Module({
  imports: [ProxyModule],
  controllers: [
    AuthRoutesController,
    ArticlesRoutesController,
    CategoriesRoutesController,
    TagsRoutesController,
  ],
})
export class RoutesModule {}
