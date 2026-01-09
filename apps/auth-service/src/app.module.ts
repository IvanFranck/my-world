import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import * as Joi from 'joi';
import { PrismaService } from './database/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        BETTER_AUTH_URL: Joi.string().required(),
        BETTER_AUTH_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: (prisma: PrismaService) => ({
        auth: betterAuth({
          database: prismaAdapter(prisma, {
            provider: 'postgresql',
          }),
          plugins: [openAPI()],
        }),
        middleware: (req, _res, next) => {
          req.url = req.originalUrl;
          req.baseUrl = '';
          next();
        },
      }),
      inject: [PrismaService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
