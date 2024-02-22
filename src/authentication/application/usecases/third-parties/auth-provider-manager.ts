import { HttpStatus, Injectable } from '@nestjs/common';
import { Exception } from '../../../../common/exception';
import { Auth, AuthProvider, AuthProviderType, AuthUser } from './auth-provider';

@Injectable()
export class AuthProviderManager {
  constructor(private readonly authProviders: AuthProvider[]) {}

  async authenticate(auth: Auth, provider: AuthProviderType): Promise<AuthUser> {
    const authProvider = this.findProvider(auth, provider);
    return authProvider.authenticate(auth);
  }

  private findProvider(auth: Auth, type: AuthProviderType): AuthProvider {
    const authProvider = this.authProviders.find((provider) => provider.isSupport(type));

    if (!authProvider) {
      throw new InvalidAuthenticationMethodException(`Could not find auth provider ${auth.constructor.name}`);
    }

    return authProvider;
  }
}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_AUTHENTICATION_METHOD' })
export class InvalidAuthenticationMethodException extends Error {}
