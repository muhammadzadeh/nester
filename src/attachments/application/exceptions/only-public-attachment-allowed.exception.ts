import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({
  errorCode: 'PUBLIC_ATTACHMENT_ALLOWED',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class OnlyPublicAttachmentAllowedException extends Error {}
