import { FilmTransaction } from './film-transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  director: string;

  @Column({ name: 'release_year' })
  releaseYear: number;

  @Column({ type: 'simple-array', nullable: true })
  genre: string[] | null;

  @Column()
  price: number;

  @Column()
  duration: number;

  @Column({ name: 'video_url' })
  videoUrl: string;

  @Column({ name: 'cover_image_url', type: 'varchar', nullable: true })
  coverImageUrl: string | null;

  @OneToMany(() => FilmTransaction, (filmTransaction) => filmTransaction.film)
  filmTransactions: FilmTransaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
