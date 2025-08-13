import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export interface Cat {
  name: string;
  age: number;
}
@Controller({
  version: '2',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): BaseResponse.Root<Cat> {
    const data = this.appService.getHello();
    return data;
  }

  @Get('test')
  getTest(): BaseResponse.Root<Cat> {
    const data = this.appService.getHello();
    return data;
  }
}
