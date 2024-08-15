import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { join } from 'path';

async function bootstrap() {
  // Create nest app
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Logger using nestjs-pino
  app.useLogger(app.get(Logger));

  // Setup template engine and static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Listen to request
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
