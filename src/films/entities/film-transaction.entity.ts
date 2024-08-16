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

  // When a film is deleted, all of its film_id in transactions are set to null (not deleted, to show that the film is no longer available)
  @ManyToOne(() => Film, (film) => film.filmTransactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'film_id' })
  film: Film | null;

  // When a user is deleted, all of their transactions are deleted as well
  @ManyToOne(() => User, (user) => user.filmTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
