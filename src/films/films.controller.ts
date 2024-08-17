import { FilmDetailResponseDto, FilmOverviewResponseDto } from './dto';
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
import { FormDataRequest } from 'nestjs-form-data';
import { UserPayload } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/guards';
import { ReqUser, Roles } from 'src/common/decorators';
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
    // API Contract in the specification doesnt use pagination (only search query)
    const { films } = await this.filmsService.findAll(query);

    // Map to response
    const responseData = FilmOverviewResponseDto.fromFilms(films);

    return ResponseDto.success('Films retrieved successfully"', responseData);
  }

  // Not FE Admin Requirement
  // @Get('purchases')
  // @HttpCode(200)
  // async getPurchases(@ReqUser() user: UserPayload) {
  //   const { filmTransactions } = await this.filmsService.getPurchases(user.id);

  //   // Map to response
  //   const responseData =
  //     FilmPurchasesResponseDto.fromFilmTransactions(filmTransactions);

  //   return ResponseDto.success(
  //     'Purchased films retrieved successfully',
  //     responseData,
  //   );
  // }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const film = await this.filmsService.findOne(id);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(film);

    return ResponseDto.success('Film retrieved successfully', responseData);
  }

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
    const responseData = FilmDetailResponseDto.fromFilm(updatedFilm);

    return ResponseDto.success('Film updated successfully', responseData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const removedFilm = await this.filmsService.remove(id);

    // Map to response
    const responseData = FilmDetailResponseDto.fromFilm(removedFilm);

    return ResponseDto.success('Film deleted successfully', responseData);
  }

  // Not FE Admin Requirement
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
