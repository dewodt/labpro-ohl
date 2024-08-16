import { Film } from './film.entity';
import { User } from 'src/users/entities';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('film_transactions')
@Index(['film', 'user'], { unique: true })
export class FilmTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Film, (film) => film.filmTransactions)
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => User, (user) => user.filmTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
