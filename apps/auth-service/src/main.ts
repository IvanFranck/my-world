import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const config = app.get<ConfigService>(ConfigService);
  await app.listen(config.get<number>('PORT') ?? 3000);

  console.log(`Auth service is running on port ${config.get('PORT')}`);
}
void bootstrap();
