import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Film } from 'src/films/entities';
import { FilmTransaction } from 'src/films/entities/film-transaction.entity';
import { Role, User } from 'src/users/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Seeds the database with data.
   */
  async seed() {
    const generatedUsers: User[] = [];
    const generatedFilms: Film[] = [];
    const generatedFilmTransactions: FilmTransaction[] = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // Generate users
    // Admin
    const adminPassword = await hash('admin123', 10);
    const adminUser = queryRunner.manager.create(User, {
      id: faker.string.uuid(),
      username: 'admin',
      email: 'admin@gmail.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      balance: 0,
    });
    generatedUsers.push(adminUser);

    // 10 users
    const userPassword = await hash('password', 10);
    for (let i = 1; i <= 10; i++) {
      const user = queryRunner.manager.create(User, {
        id: faker.string.uuid(),
        username: `user${i}`,
        email: `user${i}@mail.com`,
        name: `User ${i}`,
        password: userPassword,
        role: Role.USER,
        balance: faker.number.int({ min: 0, max: 1000 }),
      });
      generatedUsers.push(user);
    }

    // Generate films
    // Generate 30 films
    const genres = [
      'Action',
      'Adventure',
      'Comedy',
      'Drama',
      'Fantasy',
      'Horror',
      'Mystery',
      'Thriller',
    ];
    const videos: string[] = [
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814095/labpro-ohl/videos/b2ulal9rzo5bifzjzm9l.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814079/labpro-ohl/videos/yhbxctful0bgmpqreglw.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814067/labpro-ohl/videos/gxu0mlxnsvt7e3rkqyve.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814062/labpro-ohl/videos/jchwkqtam4s5ou6mzyqh.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814062/labpro-ohl/videos/ka8jffmpnlkk3nugbp60.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814059/labpro-ohl/videos/gndbsy92asiebapklnje.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814048/labpro-ohl/videos/nx66gczl8ja9ujgx7yii.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814038/labpro-ohl/videos/hmldun9uizdvtbz3jun2.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814021/labpro-ohl/videos/tfbw5ofudvkawsvpmz57.mp4',
      'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814019/labpro-ohl/videos/txmg0jebxmjpedwhlfdv.mp4',
    ];
    const cover_images: string[] = [
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813912/labpro-ohl/cover-images/gucjcuzq4vnxplc8elzk.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813902/labpro-ohl/cover-images/q5q3h20halhpvqy9hulr.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813901/labpro-ohl/cover-images/oxxo5jfrotpamkar2vbo.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813893/labpro-ohl/cover-images/yuzuqzklmh1dcujjchrs.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813890/labpro-ohl/cover-images/c60j4ouz3vf50bt7nopw.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813888/labpro-ohl/cover-images/xthzt9bsr3kspul9n30r.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813888/labpro-ohl/cover-images/zhp3vkzm6exmoa2iqzyr.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813886/labpro-ohl/cover-images/jqu0uck7jonydpfebfu5.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813886/labpro-ohl/cover-images/xxy2wny5o285daypzxdq.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813885/labpro-ohl/cover-images/yiyrmzk51z2mfvt7avdw.jpg',
      'https://res.cloudinary.com/dvzs47hay/image/upload/v1723813885/labpro-ohl/cover-images/cqrnx7grgub56gcaw4rj.jpg',
    ];
    for (let i = 1; i <= 30; i++) {
      const selectedGenres = faker.helpers.arrayElements(
        genres,
        faker.number.int({ min: 1, max: 3 }),
      );

      const selectedVideos = videos[(i - 1) % videos.length];

      const selectedCoverImages =
        faker.number.int({ min: 0, max: 100 }) > 15
          ? cover_images[(i - 1) % cover_images.length]
          : null;

      const film = queryRunner.manager.create(Film, {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        director: faker.person.fullName(),
        releaseYear: faker.number.int({ min: 1200, max: 2024 }),
        duration: faker.number.int({ min: 60 * 5, max: 3600 * 3 }),
        price: faker.number.int({ min: 1, max: 2000 }),
        genre: selectedGenres,
        coverImageUrl: selectedCoverImages,
        videoUrl: selectedVideos,
      });

      generatedFilms.push(film);
    }

    // Generate film transactions
    // Generate 3-5 transaction for each user
    for (const user of generatedUsers) {
      for (let i = 1; i <= faker.number.int({ min: 3, max: 5 }); i++) {
        // 10% chance that movie is deleted (null)
        const film =
          faker.number.int({ min: 0, max: 100 }) > 10
            ? faker.helpers.arrayElement(generatedFilms)
            : null;

        const transaction = queryRunner.manager.create(FilmTransaction, {
          id: faker.string.uuid(),
          user,
          film,
        });

        generatedFilmTransactions.push(transaction);
      }
    }

    // Start transaction
    await queryRunner.startTransaction();

    // Delete all previous data
    try {
      await queryRunner.manager.delete(FilmTransaction, {});
      await queryRunner.manager.delete(Film, {});
      await queryRunner.manager.delete(User, {});
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }

    // Insert new data
    try {
      await queryRunner.manager.save(User, generatedUsers);
      await queryRunner.manager.save(Film, generatedFilms);
      await queryRunner.manager.save(
        FilmTransaction,
        generatedFilmTransactions,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }

    // Release connection
    await queryRunner.release();
    console.log('Seeding completed');
  }

  /**
   * Clears the database.
   */
  async clear() {
    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(FilmTransaction, {});
      await queryRunner.manager.delete(Film, {});
      await queryRunner.manager.delete(User, {});
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }

    // Release connection
    await queryRunner.release();
    console.log('Clearing completed');
  }
}
