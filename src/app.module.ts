import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';
import { CustomValidationPipe } from './common/pipes';
import { ConfigModule, ConfigService, loggerConfig } from './config';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';

@Module({
  controllers: [AppController],
  imports: [
    // Global NestJS ConfigModule Wrapper,
    ConfigModule,
    // Global common module
    CommonModule,
    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    // Logger (nestjs-pino) module
    LoggerModule.forRoot(loggerConfig),
    // Other modules
    UsersModule,
    AuthModule,
  ],
  providers: [
    // App service
    AppService,
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
