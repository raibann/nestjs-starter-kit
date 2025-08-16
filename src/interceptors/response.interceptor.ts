import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from 'src/dto/response.dto';

/**
 * Interface for a standardized success response.
 * This structure will be applied to all successful API calls.
 */

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  /**
   * Intercepts the request and formats the response.
   * This handles the success case, wrapping the original data.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    // We use the `map` operator to transform the data returned by the route handler.
    return next
      .handle()
      .pipe(map((data) => ResponseDto.success('Success', data)));
  }
}
