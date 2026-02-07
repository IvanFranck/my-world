import { Module } from '@nestjs/common';
import { AuthRoutesController } from './auth-routes.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ArticlesRoutesController } from './articles-routes.controller';

@Module({
  imports: [ProxyModule],
  controllers: [AuthRoutesController, ArticlesRoutesController],
})
export class RoutesModule {}
