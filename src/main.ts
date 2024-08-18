import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import { Logger } from 'nestjs-pino';
import { resolve } from 'path';
import { formatDuration } from 'views/helpers';

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

  // Cookie parser
  app.use(cookieParser());

  // Setup template engine and static files
  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs');
  hbs.registerHelper('formatDuration', formatDuration);
  hbs.registerPartials(resolve('./views/partials'));

  // Listen to request
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
