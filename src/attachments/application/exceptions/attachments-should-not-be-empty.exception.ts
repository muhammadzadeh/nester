import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({
  errorCode: 'ATTACHMENT_LIST_EMPTY',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class AttachmentsShouldNotBeEmptyException extends Error {}
