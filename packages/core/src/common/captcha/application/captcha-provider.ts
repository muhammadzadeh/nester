import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../exception';

export const CAPTCHA_PROVIDER_TOKEN = Symbol('Captcha');

export interface CaptchaProvider {
  validate(token: string): Promise<boolean>;
  getName(): string;
}

@Exception({
  errorCode: 'INVALID_CAPTCHA_TOKEN',
  statusCode: HttpStatus.FORBIDDEN,
})
export class InvalidRecaptchaException extends Error {}
