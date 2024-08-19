import { CreateFilmRequestDto } from './create-film.dto';
import { OmitType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UpdateFilmRequestDto extends OmitType(CreateFilmRequestDto, [
  'video',
] as const) {
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e8 * 0.5, {
    message: 'Video file size must be less than 50MB',
  })
  @HasMimeType(['video/mp4', 'video/webm'], {
    message: 'Video must be in mp4, or webm',
  })
  video: MemoryStoredFile | undefined;
}
