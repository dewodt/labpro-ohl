import { CreateFilmRequestDto, UpdateFilmRequestDto } from './dto';
import { FilmTransaction } from './entities/film-transaction.entity';
import { Film } from './entities/film.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BucketService } from 'src/bucket/bucket.service';
import { PaginationDao } from 'src/common/dao';
import { PaginationParams } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dto';
import { User } from 'src/users/entities';
import { DataSource, QueryFailedError } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilmsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly bucketService: BucketService,
  ) {}

  async create(body: CreateFilmRequestDto): Promise<Film> {
    // Pregenerate Movie ID
    const newFilmID = uuidv4();

    // Upload the video
    let videoUrl: string | undefined = undefined;
    try {
      videoUrl = await this.bucketService.upload(body.video, {
        public_id: `videos/${newFilmID}`, // File name on Cloudinary
        resource_type: 'video', // The type of file to upload
      });
    } catch (error) {
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to upload video'),
      );
    }

    // Upload the thumbnail
    let coverImageUrl: string | undefined = undefined;
    if (body.cover_image) {
      try {
        coverImageUrl = await this.bucketService.upload(body.cover_image, {
          public_id: `cover-images/${newFilmID}`, // File name on Cloudinary
          resource_type: 'image', // The type of file to upload
        });
      } catch (error) {
        throw new InternalServerErrorException(
          ResponseDto.error('Failed to upload cover image'),
        );
      }
    }

    try {
      // Create & save the film
      const filmRepository = this.dataSource.getRepository(Film);
      const newFilm = await filmRepository.save({
        id: newFilmID,
        title: body.title,
        description: body.description,
        coverImageUrl: coverImageUrl,
        director: body.director,
        releaseYear: body.release_year,
        duration: body.duration,
        genre: body.genre,
        price: body.price,
        videoUrl: videoUrl,
      });

      return newFilm;
    } catch (error) {
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to save film'),
      );
    }
  }

  async findAll(
    titleOrDirectorQuery?: string,
    pagination?: PaginationParams,
  ): Promise<{
    films: Film[];
    pagination: PaginationDao | undefined;
  }> {
    // Get all films

    try {
      const filmRepository = this.dataSource.getRepository(Film);
      let filmsQuery = filmRepository.createQueryBuilder('film');

      // Filter by title or director
      if (titleOrDirectorQuery) {
        filmsQuery = filmsQuery.where(
          'film.title ILIKE :query OR film.director ILIKE :query',
          {
            query: `%${titleOrDirectorQuery}%`,
          },
        );
      }

      // Order by release year
      filmsQuery = filmsQuery.orderBy('film.releaseYear', 'DESC');

      if (pagination) {
        // Count total films
        const totalFilms = await filmsQuery.getCount();
        if (totalFilms === 0) {
          return {
            films: [],
            pagination: undefined,
          };
        }

        // Pagination
        const totalPage = Math.ceil(totalFilms / pagination.limit);
        const page = Math.min(pagination.page, totalPage);
        const limit = pagination.limit;

        filmsQuery = filmsQuery.skip((page - 1) * limit).take(limit);

        const films = await filmsQuery.getMany();

        return {
          films,
          pagination: new PaginationDao(page, limit, totalFilms),
        };
      } else {
        // No pagination
        const films = await filmsQuery.getMany();

        return {
          films,
          pagination: undefined,
        };
      }
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get films'),
      );
    }
  }

  async findOne(id: string): Promise<Film> {
    // Get film
    const filmRepository = this.dataSource.getRepository(Film);

    let film: Film | null = null;
    try {
      film = await filmRepository.findOneBy({ id });
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get film'),
      );
    }

    // Not found
    if (!film) {
      throw new NotFoundException(ResponseDto.error('Film not found'));
    }

    return film;
  }

  async update(id: string, body: UpdateFilmRequestDto): Promise<Film> {
    // Validate film id
    const filmRepository = this.dataSource.getRepository(Film);

    let film: Film | null = null;
    try {
      film = await filmRepository.findOneBy({ id });
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get film'),
      );
    }

    // Not found
    if (!film) {
      throw new NotFoundException(ResponseDto.error('Film not found'));
    }

    // Handle new video upload
    let newVideoUrl: string | undefined = undefined;
    if (body.video) {
      try {
        newVideoUrl = await this.bucketService.upload(body.video, {
          public_id: `videos/${id}`, // File name on Cloudinary, override the old one
          resource_type: 'video', // The type of file to upload
        });
      } catch (error) {
        throw new InternalServerErrorException(
          ResponseDto.error('Failed to upload video'),
        );
      }
    }

    // Handle new cover image upload
    let newCoverImageUrl: string | undefined = undefined;
    if (body.cover_image) {
      try {
        newCoverImageUrl = await this.bucketService.upload(body.cover_image, {
          public_id: `cover-images/${id}`, // File name on Cloudinary, override the old one
          resource_type: 'image', // The type of file to upload
        });
      } catch (error) {
        throw new InternalServerErrorException(
          ResponseDto.error('Failed to upload cover image'),
        );
      }
    }

    // Update film
    try {
      const updatedFilm = await filmRepository.save({
        id,
        title: body.title,
        description: body.description,
        director: body.director,
        releaseYear: body.release_year,
        genre: body.genre,
        price: body.price,
        duration: body.duration,
        videoUrl: newVideoUrl,
        coverImageUrl: newCoverImageUrl,
      });

      return updatedFilm;
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to update film'),
      );
    }
  }

  async remove(id: string): Promise<Film> {
    // Validate user id
    const filmRepository = this.dataSource.getRepository(Film);

    let film: Film | null = null;
    try {
      film = await filmRepository.findOneBy({ id });
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get film'),
      );
    }

    // Not found
    if (!film) {
      throw new NotFoundException(ResponseDto.error('Film not found'));
    }

    // Remove film
    try {
      await filmRepository.remove(film);
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to remove film'),
      );
    }

    // NOTE:
    // To ease db seeding, we will not delete the video and cover_image
    // because some of the image will be reused for serveral films in the seeding
    // (to reduce storage usage +  to make the seeding process faster (uploading image/video is very slow))

    // // Ignore transactional error, proceed to delete blob data
    // // No way to rollback file upload if one of them failed
    // // Delete blob data to reduce storage usage
    // try {
    //   await this.bucketService.delete(`videos/${id}`);
    //   if (film.coverImageUrl) {
    //     await this.bucketService.delete(`cover-images/${id}`);
    //   }
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     ResponseDto.error('Failed to delete film and coverimage data'),
    //   );
    // }

    // https://github.com/typeorm/typeorm/issues/7024
    film.id = id;

    return film;
  }

  /**
   * Buy a film
   *
   * @param filmId
   * @param userId
   * @returns new user data and bought film data
   */
  async buy(filmId: string, userId: string): Promise<[User, Film]> {
    // Get film and user data
    const filmRepository = this.dataSource.getRepository(Film);
    const userRepository = this.dataSource.getRepository(User);

    let film: Film | null = null;
    let user: User | null = null;

    try {
      [film, user] = await Promise.all([
        filmRepository.findOneBy({ id: filmId }),
        userRepository.findOneBy({ id: userId }),
      ]);
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get film or user'),
      );
    }

    // Not found
    if (!film) {
      throw new NotFoundException(ResponseDto.error('Film not found'));
    }
    if (!user) {
      throw new NotFoundException(ResponseDto.error('User not found'));
    }

    // Check if user balance is enough
    if (user.balance < film.price) {
      throw new BadRequestException(
        ResponseDto.error("User's balance is not enough"),
      );
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Add new film_transactions
      const newFilmTransaction = queryRunner.manager.create(FilmTransaction, {
        film,
        user,
      });
      await queryRunner.manager.save(newFilmTransaction);

      // Update user balance
      user.balance -= film.price;
      user = await queryRunner.manager.save(user);

      // Commit transaction
      await queryRunner.commitTransaction();

      return [user, film];
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        // If user already bought the film
        await queryRunner.rollbackTransaction();
        throw new BadRequestException(
          ResponseDto.error('User already bought the film'),
        );
      } else {
        // Unexpected error
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(
          ResponseDto.error('Failed to buy film'),
        );
      }
    }
  }

  /**
   * Get all films bought by a user
   *
   * If searchQuery is provided, it will filter the films by title or director
   * If pagination is provided, it will paginate the result
   *
   * @param userId
   * @param searchQuery
   * @param pagination
   * @returns
   */
  async getPurchases(
    userId: string,
    searchQuery?: string,
    pagination?: PaginationParams,
  ): Promise<{
    filmTransactions: FilmTransaction[];
    pagination: PaginationDao | undefined;
  }> {
    // Get all films bought by userID

    try {
      const filmTransactionRepository =
        this.dataSource.getRepository(FilmTransaction);
      let filmTransactionQueryBuilder =
        filmTransactionRepository.createQueryBuilder('filmTransaction');

      // Filter by user id and left join film
      // order by time bought
      filmTransactionQueryBuilder = filmTransactionQueryBuilder
        .where('filmTransaction.user_id = :userId', { userId })
        .leftJoinAndSelect('filmTransaction.film', 'film')
        .orderBy('filmTransaction.createdAt', 'DESC');

      // Filter by title or director
      if (searchQuery) {
        filmTransactionQueryBuilder = filmTransactionQueryBuilder.andWhere(
          '(film.title ILIKE :query OR film.director ILIKE :query)',
          {
            query: `%${searchQuery}%`,
          },
        );
      }

      // Paginate
      if (pagination) {
        const totalTransactions = await filmTransactionQueryBuilder.getCount();
        if (totalTransactions === 0) {
          return {
            filmTransactions: [],
            pagination: undefined,
          };
        }

        const totalPage = Math.ceil(totalTransactions / pagination.limit);
        const page = Math.min(pagination.page, totalPage);
        const limit = pagination.limit;

        filmTransactionQueryBuilder = filmTransactionQueryBuilder
          .skip((page - 1) * limit)
          .take(limit);

        const filmTransactions = await filmTransactionQueryBuilder.getMany();

        return {
          filmTransactions: filmTransactions,
          pagination: new PaginationDao(page, limit, totalTransactions),
        };
      } else {
        // No pagination
        const filmTransactions = await filmTransactionQueryBuilder.getMany();

        return {
          filmTransactions: filmTransactions,
          pagination: undefined,
        };
      }
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get films'),
      );
    }
  }
}
