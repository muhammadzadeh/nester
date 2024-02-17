import { Email, Mobile } from '../../../common/types';
import { AuthProviderType } from './auth-provider.enum';

export class AuthUser {
  constructor(
    readonly providerId: string,
    readonly provider: AuthProviderType,
    readonly email: Email | null,
    readonly mobile: Mobile | null,
    readonly firstName: string | null,
    readonly lastName: string | null,
    readonly avatar: string | null,
    readonly isEmailVerified?: boolean,
    readonly isMobileVerified?: boolean,
  ) {}

  isVerified(): boolean {
    return !!this.isEmailVerified || !!this.isMobileVerified;
  }
}
