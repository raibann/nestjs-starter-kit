import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }
  protected override exceptionFactory = (errors: ValidationError[]) => {
    const errorResponse = errors.map((error) =>
      Object.values(error.constraints).join(', '),
    );
    return new BadRequestException(errorResponse);
  };
}
