import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CAPTCHA_CUSTOM_HEADER_KEY, CaptchaMetaKey } from '../constants';
import { ICaptcha } from '../providers';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly captchaProvider: ICaptcha) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    const route = context.getHandler();
    const check_captcha_controller = this.reflector.get<true | false | undefined>(CaptchaMetaKey.CAPTCHA, controller);
    const check_captcha_route = this.reflector.getAllAndOverride<true | false | undefined>(CaptchaMetaKey.CAPTCHA, [
      controller,
      route,
    ]);

    if (check_captcha_route !== true && check_captcha_controller == undefined) {
      return true;
    }

    const headers = context.switchToHttp().getRequest()['headers'];
    const captcha_token = headers ? headers[CAPTCHA_CUSTOM_HEADER_KEY] : undefined;

    return this.captchaProvider.validate(captcha_token);
  }
}
