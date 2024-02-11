import { isEmail } from 'class-validator';
import { Email, Mobile } from '../../../../common/types';
import { Auth } from '../../../application/providers/auth-provider.interface';

export class IdentifierPasswordSignup implements Auth {
  constructor(
    readonly identifier: Email | Mobile,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
  ) {}

  isEmail(): boolean {
    return isEmail(this.identifier);
  }
}
