import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import * as Joi from 'joi';
import { PrismaService } from './database/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { BETTER_AUTH_SESSION_TOKEN_NAME } from '@my-website/constants';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        BETTER_AUTH_URL: Joi.string().required(),
        BETTER_AUTH_SECRET: Joi.string().required(),
        BETTER_AUTH_SESSION_TOKEN_LIFETIME: Joi.number().required(),
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: Joi.number().required(),
        BETTER_AUTH_SESSION_TOKEN_EXPIRESIN: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: (prisma: PrismaService, config: ConfigService) => ({
        auth: betterAuth({
          database: prismaAdapter(prisma, {
            provider: 'postgresql',
          }),
          plugins: [openAPI()],
          emailAndPassword: {
            enabled: true,
          },
          advanced: {
            cookies: {
              sessionToken: {
                name: BETTER_AUTH_SESSION_TOKEN_NAME as string,
                options: {
                  httpOnly: true,
                  secure: config.get('NODE_ENV') === 'production',
                  sameSite: 'lax',
                  path: '/',
                  maxAge: 60 * 60 * 24 * 7, // 7 jours
                },
              },
            },
          },
        }),
        middleware: (req, _res, next) => {
          req.url = req.originalUrl;
          req.baseUrl = '';
          next();
        },
      }),
      inject: [PrismaService, ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
