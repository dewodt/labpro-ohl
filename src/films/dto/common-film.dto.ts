import { Film } from '../entities/film.entity';

/**
 * Film overview data (without video URL and description)
 */
export class FilmOverviewResponseDto {
  id: string;
  title: string;
  director: string;
  release_year: number;
  genre: string[];
  price: number;
  duration: number;
  cover_image_url: string | null;
  created_at: Date;
  updated_at: Date;

  constructor(film: Film) {
    this.id = film.id;
    this.title = film.title;
    this.director = film.director;
    this.release_year = film.releaseYear;
    this.genre = film.genre || [];
    this.price = film.price;
    this.duration = film.duration;
    this.cover_image_url = film.coverImageUrl;
    this.created_at = film.createdAt;
    this.updated_at = film.updatedAt;
  }

  /**
   * Convert a Film entity to a FilmOverviewResponseDto
   * @param film The Film entity to convert
   */
  static fromFilm(film: Film): FilmOverviewResponseDto {
    return new FilmOverviewResponseDto(film);
  }

  /**
   * Convert an array of Film entities to an array of FilmOverviewResponseDto
   * @param films The array of Film entities to convert
   */
  static fromFilms(films: Film[]): FilmOverviewResponseDto[] {
    return films.map((film) => FilmOverviewResponseDto.fromFilm(film));
  }
}

/**
 * Film detail but with hidden video URL
 * (for non authenticated users and non admin users who havent bought the film)
 */
export class FilmDetailHiddenVideoResponse extends FilmOverviewResponseDto {
  description: string;

  constructor(film: Film) {
    super(film);
    this.description = film.description;
  }

  /**
   * Convert a Film entity to a FilmDetailResponseDto
   * @param film The Film entity to convert
   */
  static fromFilm(film: Film): FilmDetailHiddenVideoResponse {
    return new FilmDetailHiddenVideoResponse(film);
  }

  /**
   * Convert an array of Film entities to an array of FilmDetailResponseDto
   * @param films The array of Film entities to convert
   */
  static fromFilms(films: Film[]): FilmDetailHiddenVideoResponse[] {
    return films.map((film) => FilmDetailHiddenVideoResponse.fromFilm(film));
  }
}

/**
 * Film detail data (with video URL and description)
 * For admin users or users who have bought the film
 */
export class FilmDetailWithVideoResponseDto extends FilmDetailHiddenVideoResponse {
  video_url: string;

  constructor(film: Film) {
    super(film);
    this.video_url = film.videoUrl;
  }

  /**
   * Convert a Film entity to a FilmDetailResponseDto
   * @param film The Film entity to convert
   */
  static fromFilm(film: Film): FilmDetailWithVideoResponseDto {
    return new FilmDetailWithVideoResponseDto(film);
  }

  /**
   * Convert an array of Film entities to an array of FilmDetailResponseDto
   * @param films The array of Film entities to convert
   */
  static fromFilms(films: Film[]): FilmDetailWithVideoResponseDto[] {
    return films.map((film) => FilmDetailWithVideoResponseDto.fromFilm(film));
  }
}
