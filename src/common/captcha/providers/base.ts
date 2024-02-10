import { CaptchaProvider } from '../constants';

export abstract class ICaptcha {
  abstract validate(token: string): Promise<boolean>;
  abstract getName(): CaptchaProvider;
}
