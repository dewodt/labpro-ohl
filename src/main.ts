import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { resolve } from 'path';

async function bootstrap() {
  // Create nest app
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Logger using nestjs-pino
  app.useLogger(app.get(Logger));

  // Cors
  app.enableCors({
    origin: [
      process.env.APP_URL || 'http://localhost:3000',
      'https://labpro-fe.hmif.dev',
    ],
    methods: 'GET,DELETE,HEAD,PUT,PATCH,POST,OPTIONS',
    allowedHeaders: 'Origin, Content-Type, Authorization',
    exposedHeaders: 'Content-Length',
    credentials: true,
    maxAge: 24 * 60 * 60,
  });

  // Setup template engine and static files
  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs');

  // Listen to request
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
