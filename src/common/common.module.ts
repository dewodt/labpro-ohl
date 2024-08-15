import { CustomValidationPipe } from './pipes';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [CustomValidationPipe],
  exports: [CustomValidationPipe],
})
export class CommonModule {}
