import { Module } from '@nestjs/common';
import { AuthRoutesController } from './auth-routes.controller';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [AuthRoutesController],
})
export class RoutesModule {}
