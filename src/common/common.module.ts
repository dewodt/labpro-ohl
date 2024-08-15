import { UploadService } from './cloudinary/upload.service';
import { CustomValidationPipe } from './pipes';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [CustomValidationPipe, UploadService],
  exports: [CustomValidationPipe, UploadService],
})
export class CommonModule {}
