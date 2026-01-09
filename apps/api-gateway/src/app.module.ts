import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { AuthRoutesController } from './routes/auth-routes.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ProxyModule,
  ],
  controllers: [AuthRoutesController],
  providers: [],
})
export class AppModule {}
