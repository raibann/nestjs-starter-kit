import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from 'src/dto/response.dto';

/**
 * Interface for a standardized error response, matching the user's sample.
 */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Catches all exceptions and formats the response according to the user's sample.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    // Determine the status code based on the exception type.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine the error message.
    let errorMessage: string | string[];
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      // Handle the case where the message is a string or an array of strings.
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse.hasOwnProperty('message')
      ) {
        errorMessage = (exceptionResponse as any).message;
      } else {
        errorMessage = exception.message;
      }
    } else {
      // For unhandled exceptions, provide a generic message.
      errorMessage = 'Internal server error';
    }

    // Format the final response body.
    const errorResponseBody = ResponseDto.error(
      errorMessage as string | string[],
      status,
    );

    // Send the response with the determined status code.
    response.status(status).json(errorResponseBody);
  }
}
