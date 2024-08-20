import {
  FilmDetailHiddenVideoResponse,
  FilmDetailWithVideoResponseDto,
  FilmOverviewResponseDto,
} from './dto';
import { BuyFilmResponseDto } from './dto/buy-film-dto';
import { CreateFilmRequestDto } from './dto/create-film.dto';
import { UpdateFilmRequestDto } from './dto/update-film.dto';
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
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { UserPayload } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/guards';
import { Public, ReqUser, Roles } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dto';
import {
  SwaggerBuyFilm,
  SwaggerCreateFilm,
  SwaggerDeleteFilm,
  SwaggerGetManyFilm,
  SwaggerGetOneFilm,
  SwaggerUpdateFilm,
} from 'src/swagger/films';
import { Role } from 'src/users/entities';

@ApiTags('API: Films')
@Controller('films')
@UseGuards(JwtAuthGuard)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @SwaggerCreateFilm()
  @Post()
  @Roles(Role.ADMIN)
  @FormDataRequest()
  @HttpCode(201)
  async create(@Body() body: CreateFilmRequestDto) {
    const newFilm = await this.filmsService.create(body);

    // Map to response
    const responseData = FilmDetailWithVideoResponseDto.fromFilm(newFilm);

    return ResponseDto.success('Film created successfully', responseData);
  }

  @SwaggerGetManyFilm()
  @Get()
  @Public()
  @HttpCode(200)
  async findAll(@Query('q') query: string | undefined) {
    // API Contract in the specification doesnt use pagination (only search query)
    const { films } = await this.filmsService.findAll(query);

    // Map to response
    const responseData = FilmOverviewResponseDto.fromFilms(films);

    return ResponseDto.success('Films retrieved successfully"', responseData);
  }

  @SwaggerGetOneFilm()
  @Get(':id')
  @Public()
  @HttpCode(200)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ReqUser() reqUser: UserPayload | undefined,
  ) {
    const film = await this.filmsService.findOne(id);

    // NOTE: HIDE vide_url if user is not admin and film is not bought
    // Because why need to buy the movie if the video_url is accessible publicly through API

    // Map to response
    if (!reqUser) {
      // Hidden video
      const responseData = FilmDetailHiddenVideoResponse.fromFilm(film);

      return ResponseDto.success('Film retrieved successfully', responseData);
    } else if (reqUser.role === Role.ADMIN) {
      // With video
      const responseData = FilmDetailWithVideoResponseDto.fromFilm(film);

      return ResponseDto.success('Film retrieved successfully', responseData);
    } else {
      // Check if user has bought the film
      const hasPurchased = await this.filmsService.hasPurchased(id, reqUser.id);

      if (!hasPurchased) {
        // Hidden video
        const responseData = FilmDetailHiddenVideoResponse.fromFilm(film);

        return ResponseDto.success('Film retrieved successfully', responseData);
      }

      // With video
      const responseData = FilmDetailWithVideoResponseDto.fromFilm(film);

      return ResponseDto.success('Film retrieved successfully', responseData);
    }
  }

  @SwaggerUpdateFilm()
  @Put(':id')
  @Roles(Role.ADMIN)
  @FormDataRequest()
  @HttpCode(200)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateFilmRequestDto,
  ) {
    // Update the film
    const updatedFilm = await this.filmsService.update(id, body);

    // Map to response
    const responseData = FilmDetailWithVideoResponseDto.fromFilm(updatedFilm);

    return ResponseDto.success('Film updated successfully', responseData);
  }

  @SwaggerDeleteFilm()
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const removedFilm = await this.filmsService.remove(id);

    // Map to response
    const responseData = FilmDetailWithVideoResponseDto.fromFilm(removedFilm);

    return ResponseDto.success('Film deleted successfully', responseData);
  }

  // Not FE Admin Requirement
  @SwaggerBuyFilm()
  @Post(':id/buy')
  @HttpCode(200)
  async buy(
    @Param('id', ParseUUIDPipe) id: string,
    @ReqUser() user: UserPayload,
  ) {
    // Buy the film
    const [updatedUser, boughtFilm] = await this.filmsService.buy(id, user.id);

    // Map to response
    const responseData = BuyFilmResponseDto.fromUserAndFilm(
      updatedUser,
      boughtFilm,
    );

    // Return the response
    return ResponseDto.success('Film bought successfully', responseData);
  }
}
