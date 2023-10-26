import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
      'X-Content-Type-Options',
      'x-csrf-token',
    ],
    credentials: true,
    origin: 'http://localhost:4200',
  });

  await app.listen(3000);
}
bootstrap();
