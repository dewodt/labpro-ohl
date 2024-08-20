import { AppModule } from './app.module';
import { swaggerConfig } from './swagger/config.swagger';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import { Logger } from 'nestjs-pino';
import { resolve } from 'path';
import { formatDuration } from 'views/helpers';
import { resizeConvertWebpCloudinaryImage } from 'views/helpers/resize-convert-webp-cloudinary-image.helper';

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
  // Helpers
  hbs.registerHelper('formatDuration', formatDuration);
  hbs.registerHelper(
    'resizeConvertWebpCloudinaryImage',
    resizeConvertWebpCloudinaryImage,
  );
  // Partials
  hbs.registerPartials(resolve('./views/partials'));

  // Swagger Setup
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  // Listen to request
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
