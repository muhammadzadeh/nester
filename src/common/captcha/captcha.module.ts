import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Configuration } from '../config';
import { CaptchaGuard } from './guards';

import { ICaptcha, Recaptcha } from './providers';
import { IsRecaptchaValidConstraint } from './validations';

const captchaProvider = {
  provide: ICaptcha,
  inject: [Configuration, HttpService],
  useFactory: (config: Configuration, httpService: HttpService): Recaptcha => {
    switch (config.captcha!.provider) {
      case 'recaptcha':
        return new Recaptcha(config, httpService);
      default:
        return new Recaptcha(config, httpService);
    }
  },
};

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [captchaProvider, IsRecaptchaValidConstraint, CaptchaGuard],
  exports: [],
})
export class CaptchaModule {}
