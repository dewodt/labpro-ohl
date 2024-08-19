import { Film } from '../films/entities';
import { FilmTransaction } from '../films/entities/film-transaction.entity';
import { User } from '../users/entities';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

// For CLI (cannot use DI because different lifecycle)
export const AppDataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User, Film, FilmTransaction],
  migrations: [resolve(__dirname, 'migrations/*.{js,ts}')],
});

async function main() {
  await AppDataSource.initialize();
}

main();
