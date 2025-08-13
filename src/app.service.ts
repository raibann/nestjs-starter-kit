import { HttpStatus, Injectable } from '@nestjs/common';
import { Cat } from './app.controller';

@Injectable()
export class AppService {
  getHello(): BaseResponse.Root<Cat> {
    return {
      data: {
        name: 'John',
        age: 20,
      },
      message: 'Hello World',
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
