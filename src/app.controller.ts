import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './guard/auth.guard';

export interface Cat {
  name: string;
  age: number;
}

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
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
