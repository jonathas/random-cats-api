import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'x-api-key',
      'Strict-Transport-Security',
      'X-Content-Type-Options'
    ],
    credentials: true,
    origin: 'http://localhost:4200'
  });

  await app.listen(3000);
}

bootstrap().catch((err) => logger.error(err));
