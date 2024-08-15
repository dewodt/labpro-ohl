import { Film } from '../entities/film.entity';

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

  constructor(
    id: string,
    title: string,
    director: string,
    release_year: number,
    genre: string[],
    price: number,
    duration: number,
    cover_image_url: string | null,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.release_year = release_year;
    this.genre = genre;
    this.price = price;
    this.duration = duration;
    this.cover_image_url = cover_image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Convert a Film entity to a FilmOverviewResponseDto
   * @param film The Film entity to convert
   */
  static fromFilm(film: Film): FilmOverviewResponseDto {
    return new FilmOverviewResponseDto(
      film.id,
      film.title,
      film.director,
      film.releaseYear,
      film.genre,
      film.price,
      film.duration,
      film.coverImageUrl,
      film.createdAt,
      film.updatedAt,
    );
  }

  /**
   * Convert an array of Film entities to an array of FilmOverviewResponseDto
   * @param films The array of Film entities to convert
   */
  static fromFilms(films: Film[]): FilmOverviewResponseDto[] {
    return films.map((film) => FilmOverviewResponseDto.fromFilm(film));
  }
}

export class FilmDetailResponseDto extends FilmOverviewResponseDto {
  description: string;
  video_url: string;

  constructor(
    id: string,
    title: string,
    director: string,
    release_year: number,
    genre: string[],
    price: number,
    duration: number,
    cover_image_url: string | null,
    created_at: Date,
    updated_at: Date,
    description: string,
    video_url: string,
  ) {
    super(
      id,
      title,
      director,
      release_year,
      genre,
      price,
      duration,
      cover_image_url,
      created_at,
      updated_at,
    );
    this.description = description;
    this.video_url = video_url;
  }

  /**
   * Convert a Film entity to a FilmDetailResponseDto
   * @param film The Film entity to convert
   */
  static fromFilm(film: Film): FilmDetailResponseDto {
    return new FilmDetailResponseDto(
      film.id,
      film.title,
      film.director,
      film.releaseYear,
      film.genre,
      film.price,
      film.duration,
      film.coverImageUrl,
      film.createdAt,
      film.updatedAt,
      film.description,
      film.videoUrl,
    );
  }

  /**
   * Convert an array of Film entities to an array of FilmDetailResponseDto
   * @param films The array of Film entities to convert
   */
  static fromFilms(films: Film[]): FilmDetailResponseDto[] {
    return films.map((film) => FilmDetailResponseDto.fromFilm(film));
  }
}
