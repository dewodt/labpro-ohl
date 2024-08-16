import { FilmDetailResponseDto, FilmOverviewResponseDto } from './dto';
import { CreateFilmRequestDto } from './dto/create-film.dto';
import { FilmsService } from './films.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dto';
import { Role } from 'src/users/entities';

@Controller('films')
@UseGuards(JwtAuthGuard)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @FormDataRequest()
  @HttpCode(201)
  async create(@Body() body: CreateFilmRequestDto) {
    const newFilm = await this.filmsService.create(body);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(newFilm);

    return ResponseDto.success('Film created successfully', responseData);
  }

  @Get()
  @HttpCode(200)
  async findAll(@Query('q') query: string | undefined) {
    const films = await this.filmsService.findAll(query);

    // Map to response
    const responseData = FilmOverviewResponseDto.fromFilms(films);

    return ResponseDto.success('Films retrieved successfully"', responseData);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const film = await this.filmsService.findOne(id);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(film);

    return ResponseDto.success('Film retrieved successfully', responseData);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
  //   return this.filmsService.update(+id, updateFilmDto);
  // }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const removedFilm = await this.filmsService.remove(id);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(removedFilm);

    return ResponseDto.success('Film deleted successfully', responseData);
  }
}
