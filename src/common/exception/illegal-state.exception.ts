import { HttpStatus } from '@nestjs/common';
import { Exception } from './decorator';

@Exception({
  errorCode: 'ILLEGAL_STATE',
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
})
export class IllegalStateException extends Error {}
