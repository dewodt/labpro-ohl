import { WebMoviesController, WebAuthController } from './controllers';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  AuthenticatedOnlyMiddleware,
  NonAuthenticatedOnlyMiddleware,
} from 'src/auth/middlewares';
import { FilmsModule } from 'src/films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [WebAuthController, WebMoviesController],
})
export class WebModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Cannot use guards, since guards throws Http exception (not redirect)

    // Non Auth Access Only
    // If user is authenticated and tries to access these routes, redirect to /my-movies
    consumer
      .apply(NonAuthenticatedOnlyMiddleware)
      .forRoutes('/auth/login', '/auth/register');

    // Auth Access Only
    // If user is not authenticated and tries to access these routes, redirect to /auth/login
    consumer
      .apply(AuthenticatedOnlyMiddleware)
      .forRoutes('/my-movies', '/movies/*/watch');
  }
}
