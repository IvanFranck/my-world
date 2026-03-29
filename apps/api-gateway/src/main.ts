import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Boostrap');

  // use cookiparser to read cookies
  app.use(cookieParser());

  // security
  app.use(helmet());

  // compression
  app.use(compression());

  app.enableCors({
    origin: [
      'http://localhost:3010', // TODO: change it for prod
    ].filter(Boolean),
    credentials: true, // for cookies
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Correlation-Id',
      'Access-Control-Allow-Origin',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie', 'X-Correlation-Id'],
  });

  //Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = config.get<number>('PORT') || 3000;

  await app.listen(port);

  logger.log(`🚀 API Gateway running on port ${port}`);
  logger.log(`🍪 Cookies enabled with CORS credentials`);
}
void bootstrap();
