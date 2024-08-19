import { appConfig } from './config.app';
import { CustomConfigService } from './config.service';
import { validateConfig } from './config.validation';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env', # Automatically loads .env.development or .env.production from Docker compose
      expandVariables: true,
      isGlobal: true,
      cache: true,
      load: [appConfig],
      validate: validateConfig,
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
