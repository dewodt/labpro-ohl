import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { NonAuthenticatedOnlyMiddleware } from './middlewares';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigService } from 'src/config';

@Module({
  imports: [
    // Jwt utils
    JwtModule.registerAsync({
      inject: [CustomConfigService],
      global: true, // Instance can be used globally (for guard)
      useFactory: (configService: CustomConfigService) => ({
        secret: configService.get('jwtSecret'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, NonAuthenticatedOnlyMiddleware],
  exports: [],
})
export class AuthModule {}
