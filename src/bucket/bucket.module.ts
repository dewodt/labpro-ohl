import { BucketService } from './bucket.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}
