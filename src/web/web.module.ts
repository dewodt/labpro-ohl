import { WebMoviesController, WebAuthController } from './controllers';
import { Module } from '@nestjs/common';
import { FilmsModule } from 'src/films/films.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FilmsModule, UsersModule],
  controllers: [WebAuthController, WebMoviesController],
  // exports: [],
})
export class WebModule {}
