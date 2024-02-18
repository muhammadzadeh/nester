import { isEmail } from 'class-validator';
import { Email, Mobile } from '../../../../common/types';
import { Auth } from '../../../application/services/auth-provider';

export class OtpSignup implements Auth {
  constructor(readonly identifier: Email | Mobile) {}

  isEmail(): boolean {
    return isEmail(this.identifier);
  }
}
