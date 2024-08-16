import { FilmOverviewResponseDto } from './common-film.dto';
import { FilmTransaction } from 'src/films/entities/film-transaction.entity';

export class FilmPurchasesResponseDto {
  filmTransactionId: string;
  created_at: Date;
  updated_at: Date;
  film: FilmOverviewResponseDto | null;

  constructor(
    filmTransactionId: string,
    created_at: Date,
    updated_at: Date,
    film: FilmOverviewResponseDto | null,
  ) {
    this.filmTransactionId = filmTransactionId;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.film = film;
  }

  /**
   * Convert a FilmTransaction entity to a FilmPurchasesResponseDto
   * @param FilmTransaction
   */
  static fromFilmTransaction(
    filmTransaction: FilmTransaction,
  ): FilmPurchasesResponseDto {
    return new FilmPurchasesResponseDto(
      filmTransaction.id,
      filmTransaction.createdAt,
      filmTransaction.updatedAt,
      filmTransaction.film
        ? FilmOverviewResponseDto.fromFilm(filmTransaction.film)
        : null,
    );
  }

  static fromFilmTransactions(
    filmTransactions: FilmTransaction[],
  ): FilmPurchasesResponseDto[] {
    return filmTransactions.map((filmTransaction) =>
      FilmPurchasesResponseDto.fromFilmTransaction(filmTransaction),
    );
  }
}
