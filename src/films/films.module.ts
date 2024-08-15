import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
