import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { ConfigModule } from './config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Global NestJS ConfigModule Wrapper,
    ConfigModule,
    // Global common module
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
