import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({
  errorCode: 'INVALID_FORMAT',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class InvalidAttachmentFormatException extends Error {}
