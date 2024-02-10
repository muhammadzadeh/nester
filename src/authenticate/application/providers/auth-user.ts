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
    readonly picture: string | null,
    readonly isVerified: boolean,
  ) {}
}
