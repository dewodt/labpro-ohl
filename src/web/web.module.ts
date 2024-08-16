import { WebController } from './web.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [WebController],
})
export class WebModule {}
