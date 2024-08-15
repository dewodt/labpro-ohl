import { appConfig } from './config.app';
import { CustomConfigService } from './config.service';
import { validateConfig } from './config.validation';
import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.env',
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
export class ConfigModule {}
