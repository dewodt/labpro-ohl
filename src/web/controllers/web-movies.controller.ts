import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserPayload } from 'src/auth/auth.interface';
import { RedirectUnauthorizedFilter } from 'src/auth/filters';
import { JwtAuthGuard } from 'src/auth/guards';
import {
  Pagination,
  PaginationParams,
  Public,
  ReqUser,
} from 'src/common/decorators';
import { FilmsService } from 'src/films/films.service';
import { UsersService } from 'src/users/users.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class WebMoviesController {
  constructor(
    private readonly userService: UsersService,
    private readonly filmService: FilmsService,
  ) {}

  // Public
  @Get('movies')
  @Public()
  @Render('movies')
  async movies(
    @Query('search') searchQuery: string | undefined,
    @Pagination({ defaultLimit: 8 }) paginationQuery: PaginationParams,
  ) {
    // Fetch movies from API
    const { films, pagination } = await this.filmService.findAll(
      searchQuery,
      paginationQuery,
    );

    const previousPageUrl =
      pagination && pagination.previousPage
        ? this.buildSearchPaginationUrl(searchQuery, pagination.previousPage)
        : undefined;

    const nextPageUrl =
      pagination && pagination.nextPage
        ? this.buildSearchPaginationUrl(searchQuery, pagination.nextPage)
        : undefined;

    // Return data to handlebar for SSR
    return {
      films,
      pagination,
      search: searchQuery,
      previousPageUrl,
      nextPageUrl,
    };
  }

  // Public, but with some additional business logic
  @Get('movies/:id')
  @Public()
  @Render('movie-detail')
  async movieDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @ReqUser() reqUser: UserPayload | undefined,
  ) {
    const isUserLoggedIn = !!reqUser;

    const [film, user, hasPurchased] = await Promise.all([
      // Fetch movie from API
      this.filmService.findOne(id),
      // Get user (for balance data)
      isUserLoggedIn ? this.userService.findOne(reqUser.id) : undefined,
      // Check if user has purchased the movie
      isUserLoggedIn ? this.filmService.hasPurchased(reqUser.id, id) : false,
    ]);

    // 3 Cases:
    // 1. User is not logged in
    // 2 User logged in but hasnt purchased the movie
    // 3. User logged in and has purchased the movie

    // Return data to handlebar for SSR
    return { isUserLoggedIn, film, user, hasPurchased };
  }

  // Protected
  @Get('my-movies')
  @UseFilters(RedirectUnauthorizedFilter)
  @Render('my-movies')
  async myMovies(
    @Query('search') searchQuery: string | undefined,
    @Pagination({ defaultLimit: 8 }) paginationQuery: PaginationParams,
    @ReqUser() reqUser: UserPayload,
  ) {
    // Fetch movies from API
    const { filmTransactions, pagination } =
      await this.filmService.getPurchases(
        reqUser.id,
        searchQuery,
        paginationQuery,
      );

    const previousPageUrl =
      pagination && pagination.previousPage
        ? this.buildSearchPaginationUrl(searchQuery, pagination.previousPage)
        : undefined;

    const nextPageUrl =
      pagination && pagination.nextPage
        ? this.buildSearchPaginationUrl(searchQuery, pagination.nextPage)
        : undefined;

    // Return data to handlebar for SSR
    return {
      filmTransactions,
      pagination,
      search: searchQuery,
      previousPageUrl,
      nextPageUrl,
    };
  }

  // Protected

  private buildSearchPaginationUrl(
    search: string | undefined,
    page: number,
  ): string {
    const searchParams = new URLSearchParams();
    if (search) {
      searchParams.append('search', search);
    }
    searchParams.append('page', page.toString());

    return `/movies?${searchParams.toString()}`;
  }
}
