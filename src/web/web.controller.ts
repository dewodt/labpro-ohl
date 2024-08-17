import { Controller, Get, Query, Render } from '@nestjs/common';
import { Pagination, PaginationParams } from 'src/common/decorators';
import { FilmsService } from 'src/films/films.service';

@Controller()
export class WebController {
  constructor(private readonly filmService: FilmsService) {}

  @Get('auth/login')
  @Render('login')
  login() {
    return {};
  }

  @Get('auth/register')
  @Render('register')
  register() {
    return {};
  }

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

    // Build URLs for pagination
    const buildSearchPaginationUrl = (
      search: string | undefined,
      page: number,
    ): string => {
      const searchParams = new URLSearchParams();
      if (search) {
        searchParams.append('search', search);
      }
      searchParams.append('page', page.toString());

      return `/movies?${searchParams.toString()}`;
    };

    const previousPageUrl =
      pagination && pagination.previousPage
        ? buildSearchPaginationUrl(searchQuery, pagination.previousPage)
        : undefined;

    const nextPageUrl =
      pagination && pagination.nextPage
        ? buildSearchPaginationUrl(searchQuery, pagination.nextPage)
        : undefined;

    // Return data to view
    return {
      films,
      pagination,
      search: searchQuery,
      previousPageUrl,
      nextPageUrl,
    };
  }
}
