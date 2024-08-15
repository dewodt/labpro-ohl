import { FilmDetailResponseDto } from './dto';
import { CreateFilmRequestDto } from './dto/create-film.dto';
import { FilmsService } from './films.service';
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { ResponseDto } from 'src/common/dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @FormDataRequest()
  async create(@Body() body: CreateFilmRequestDto) {
    const newFilm = await this.filmsService.create(body);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(newFilm);

    return ResponseDto.success('Film created successfully', responseData);
  }

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
  //   return this.filmsService.update(+id, updateFilmDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.remove(+id);
  }
}
