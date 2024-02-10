import { SetMetadata } from '@nestjs/common';
import { CaptchaMetaKey } from './constants';

/**
 * check route captcha, useful for anonymous routes
 */
export const Captcha = (value = true): MethodDecorator & ClassDecorator => SetMetadata(CaptchaMetaKey.CAPTCHA, value);
