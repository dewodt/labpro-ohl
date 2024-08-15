import { ResponseDto } from '../dto';
import {
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

/**
 * Custom validation pipe to send custom response dto when error occurs
 */
@Injectable()
export class CustomValidationPipe extends NestValidationPipe {
  constructor(options: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors) => {
        const accumulateErrMessage: string[] = [];

        errors.forEach((err) => {
          const constraints = err.constraints;
          if (constraints) {
            accumulateErrMessage.push(Object.values(constraints).join(', '));
          } else {
            accumulateErrMessage.push(err.property + ' has an error field');
          }
        });

        const message = accumulateErrMessage.join(', ');

        return new BadRequestException(new ResponseDto('error', message));
      },
    });
  }
}
