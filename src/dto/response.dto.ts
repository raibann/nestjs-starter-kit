export class ResponseDto<T> {
  message: string;
  error?: string;
  statusCode: number;
  response?: T;

  constructor(
    message: string,
    statusCode: number,
    error?: string,
    response?: T,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.response = response;
  }

  static success<T>(
    message: string,
    response: T,
    statusCode: number = 200,
  ): ResponseDto<T> {
    return new ResponseDto<T>(message, statusCode, undefined, response);
  }

  static error<T>(
    message: string,
    error: string,
    statusCode: number = 503,
  ): ResponseDto<T> {
    return new ResponseDto<T>(message, statusCode, error);
  }
}

// Type alias for common response types
export type ApiResponse<T> = ResponseDto<T>;
