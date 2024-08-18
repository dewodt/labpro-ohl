import { WebMoviesController, WebAuthController } from './controllers';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NonAuthenticatedOnlyMiddleware } from 'src/auth/middlewares';
import { FilmsModule } from 'src/films/films.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [FilmsModule, UsersModule],
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
  }
}
