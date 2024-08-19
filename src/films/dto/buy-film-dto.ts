import { Film } from '../entities';
import { FilmDetailWithVideoResponseDto } from './common-film.dto';
import { User } from 'src/users/entities';

export class BuyFilmResponseDto {
  balanceLeft: number;
  film: FilmDetailWithVideoResponseDto;

  constructor(balanceLeft: number, film: Film) {
    this.balanceLeft = balanceLeft;
    this.film = FilmDetailWithVideoResponseDto.fromFilm(film);
  }

  /**
   * Convert the response from the service to a response DTO
   * @param user The user who bought the film
   * @param film The film bought
   */
  static fromUserAndFilm(user: User, film: Film): BuyFilmResponseDto {
    return new BuyFilmResponseDto(user.balance, film);
  }
}
