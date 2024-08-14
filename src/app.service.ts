import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const foo = 'hiya';
    return foo;
  }
}
