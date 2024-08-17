import { WebController } from './web.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  AuthenticatedOnlyMiddleware,
  NonAuthenticatedOnlyMiddleware,
} from 'src/auth/middlewares';

@Module({
  controllers: [WebController],
})
export class WebModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // If not authenticated, redirect to login
    consumer.apply(AuthenticatedOnlyMiddleware).forRoutes('/dashboard/*');

    // If authenticated, redirect to dashboard
    consumer
      .apply(NonAuthenticatedOnlyMiddleware)
      .forRoutes('/auth/login', '/auth/register');
  }
}
