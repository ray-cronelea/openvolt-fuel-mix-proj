import { Injectable } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return ({ message: myLib() });
  }
}
