import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

// https://github.com/arsaizdihar/labpro-ohl-fe/blob/main/src/routes/dashboard/films/%2Bpage.svelte#L84
export class UpdateFilmRequestDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsString({ message: 'Director must be a string' })
  @IsNotEmpty({ message: 'Director is required' })
  director: string;

  // https://github.com/nestjs/nest/issues/1331
  @Type(() => Number)
  @IsNumber({}, { message: 'Release year must be a number' })
  @IsInt({ message: 'Release year must be an integer' })
  @Min(1000, { message: 'Release year must be greater than 1000' })
  release_year: number;

  @IsArray({ message: 'Genre must be an array' })
  @IsString({ each: true, message: 'Genre must be an array of strings' })
  genre: string[];

  // https://github.com/nestjs/nest/issues/1331
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @IsInt({ message: 'Price must be an integer' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  // https://github.com/nestjs/nest/issues/1331
  @Type(() => Number)
  @IsNumber({}, { message: 'Duration must be a number' })
  @IsInt({ message: 'Duration must be an integer' })
  @IsPositive({ message: 'Duration must be a positive number' })
  duration: number;

  @IsOptional() // Null -> not changed
  @IsFile()
  @MaxFileSize(1e8 * 0.5, {
    message: 'Video file size must be less than 50MB',
  })
  @HasMimeType(['video/mp4', 'video/webm'], {
    message: 'Video must be in mp4, or webm',
  })
  video: MemoryStoredFile | undefined;

  @IsOptional() // Null -> not changed
  @IsFile()
  @MaxFileSize(1e6 * 2, {
    message: 'Cover image file size must be less than 2MB',
  })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Cover image must be in jpeg, png, or webp',
  })
  cover_image: MemoryStoredFile | undefined;
}
