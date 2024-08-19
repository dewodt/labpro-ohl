import { AuthModule } from './auth/auth.module';
import { BucketModule } from './bucket/bucket.module';
import { CommonModule } from './common';
import { CustomValidationPipe } from './common/pipes';
import {
  CustomConfigModule,
  CustomConfigService,
  loggerConfig,
} from './config';
import { FilmsModule } from './films/films.module';
import { UsersModule } from './users/users.module';
import { WebModule } from './web/web.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    // Global NestJS ConfigModule Wrapper,
    CustomConfigModule,
    // Global common module
    CommonModule,
    // Formdata Parser module
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    // TypeORM (DB) Moduke
    TypeOrmModule.forRootAsync({
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    // Cloudinary (Bucket) Module
    BucketModule,
    // Logger (nestjs-pino) module
    LoggerModule.forRoot(loggerConfig),
    // Web Hbs (Template) module
    WebModule,
    // Other modules
    AuthModule,
    UsersModule,
    FilmsModule,
  ],
  providers: [
    // Global custom validation pipe (for custom dto response)
    {
      provide: APP_PIPE,
      useValue: new CustomValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
    // Global error logger (nestjs-pino) interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
  ],
})
export class AppModule {}
