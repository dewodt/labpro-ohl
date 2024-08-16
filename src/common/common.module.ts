import { BucketService } from './cloudinary/bucket.service';
import { CustomValidationPipe } from './pipes';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [CustomValidationPipe, BucketService],
  exports: [CustomValidationPipe, BucketService],
})
export class CommonModule {}
