import { HttpStatus } from '@nestjs/common';

export interface Options {
  statusCode: HttpStatus;
  errorCode: string;
}
