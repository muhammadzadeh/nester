import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Configuration } from '../../config';
import { CaptchaProvider } from '../constants';
import { InvalidRecaptchaException } from '../exceptions/invalid-recaptcha.exception';
import { ICaptcha } from './base';

@Injectable()
export class Recaptcha extends ICaptcha {
  private logger = new Logger(Recaptcha.name);

  constructor(private readonly config: Configuration, private readonly httpService: HttpService) {
    super();
  }

  async validate(token: string): Promise<boolean> {
    if (!this.config.captcha || !this.config.captcha.enabled) {
      return true;
    }

    if (!token) {
      throw new InvalidRecaptchaException('The provided token is null');
    }

    const verify_url = this.config.captcha.recaptcha.verifyUrl;
    const secret = this.config.captcha.recaptcha.secret;

    try {
      const captcha = await this.httpService.axiosRef.post(`${verify_url}?secret=${secret}&response=${token}`, null, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      if (captcha.data.success === false) {
        throw new InvalidRecaptchaException('The Provider is not verified token');
      }
    } catch (error) {
      this.logger.error(error);
      throw new InvalidRecaptchaException('Token verification failed', {cause: error});
    }

    return true;
  }

  getName(): CaptchaProvider {
    return CaptchaProvider.RE_CAPTCHA;
  }
}
