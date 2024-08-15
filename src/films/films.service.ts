import { CreateFilmRequestDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadService } from 'src/common/cloudinary/upload.service';
import { ResponseDto } from 'src/common/dto';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilmsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly uploadService: UploadService,
  ) {}

  async create(body: CreateFilmRequestDto): Promise<Film> {
    // Pregenerate Movie ID
    const newFilmID = uuidv4();

    // Upload the video
    let videoUrl: string | undefined = undefined;
    try {
      videoUrl = await this.uploadService.upload(body.video, {
        public_id: `videos/${newFilmID}`, // File name on Cloudinary
        resource_type: 'video', // The type of file to upload
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to upload video'),
      );
    }

    // Upload the thumbnail
    let coverImageUrl: string | undefined = undefined;
    if (body.cover_image) {
      try {
        coverImageUrl = await this.uploadService.upload(body.cover_image, {
          public_id: `cover-images/${newFilmID}`, // File name on Cloudinary
          resource_type: 'image', // The type of file to upload
        });
      } catch (error) {
        throw new InternalServerErrorException(
          ResponseDto.error('Failed to upload cover image'),
        );
      }
    }

    try {
      // Create & save the film
      const filmRepository = this.dataSource.getRepository(Film);
      const newFilm = await filmRepository.save({
        id: newFilmID,
        title: body.title,
        description: body.description,
        coverImageUrl: coverImageUrl,
        director: body.director,
        releaseYear: body.release_year,
        duration: body.duration,
        genre: body.genre,
        price: body.price,
        videoUrl: videoUrl,
      });

      return newFilm;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to save film'),
      );
    }
  }

  findAll() {
    return `This action returns all films`;
  }

  findOne(id: number) {
    return `This action returns a #${id} film`;
  }

  // update(id: number, updateFilmDto: UpdateFilmDto) {
  //   return `This action updates a #${id} film`;
  // }

  remove(id: number) {
    return `This action removes a #${id} film`;
  }
}
