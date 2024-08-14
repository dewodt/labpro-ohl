import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { ConfigModule, loggerConfig } from './config';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    // Global NestJS ConfigModule Wrapper,
    ConfigModule,
    // Global common module
    CommonModule,
    // Logger (nestjs-pino) module
    LoggerModule.forRoot(loggerConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global error logger (nestjs-pino) interceptor
    { provide: APP_INTERCEPTOR, useClass: LoggerErrorInterceptor },
  ],
})
export class AppModule {}
