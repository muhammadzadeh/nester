import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({
  errorCode: 'ATTACHMENT_IS_TOO_BIG',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class AttachmentIsTooBigException extends Error {}
