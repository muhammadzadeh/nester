import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@package/exception/base.exception';
import { ErrorCode } from '@package/types';

export const CAPTCHA_PROVIDER_TOKEN = Symbol('Captcha');

export interface CaptchaProvider {
  validate(token: string): Promise<boolean>;
  getName(): string;
}

export class InvalidRecaptchaException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.FORBIDDEN;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.INVALID_CAPTCHA_TOKEN;
}
