import { Controller, Get, Query, Render } from '@nestjs/common';
import { UserPayload } from 'src/auth/auth.interface';
import { Pagination, PaginationParams, ReqUser } from 'src/common/decorators';
import { FilmsService } from 'src/films/films.service';

@Controller()
export class WebMoviesController {
  constructor(private readonly filmService: FilmsService) {}

  @Get('movies')
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

  @Get('my-movies')
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
