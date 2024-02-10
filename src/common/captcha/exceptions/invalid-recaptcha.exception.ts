import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../exception';

@Exception({
  errorCode: 'INVALID_CAPTCHA_TOKEN',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class InvalidRecaptchaException extends Error {}
