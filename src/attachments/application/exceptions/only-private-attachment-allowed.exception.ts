import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({
  errorCode: 'PRIVATE_ATTACHMENT_ALLOWED',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class OnlyPrivateAttachmentAllowedException extends Error {}
