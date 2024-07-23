import { ValidatorOptions } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export const ValidationConfig: ValidatorOptions | Record<string, string | number | boolean> = {
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  disableErrorMessages: false,
  skipMissingProperties: false,
  transform: true,
};
