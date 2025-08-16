import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  message: string | string[];
  statusCode: HttpStatus;
  response?: T;

  constructor(message: string | string[], status: HttpStatus, response?: T) {
    this.message = message;
    this.response = response;
    this.statusCode = status;
  }

  static success<T>(
    message: string | string[],
    response: T,
    status: HttpStatus = HttpStatus.OK,
  ): ResponseDto<T> {
    return new ResponseDto<T>(message, status, response);
  }

  static error<T>(
    message: string | string[],
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    response: T | null = null,
  ): ResponseDto<T> {
    return new ResponseDto<T>(message, statusCode, response);
  }
}
