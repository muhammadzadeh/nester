import { HttpStatus, Injectable } from '@nestjs/common';
import { Exception } from '../../../common/exception';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { Auth, AuthProvider, AuthUser } from './auth-provider';

@Injectable()
export class AuthProviderManager {
  constructor(private readonly authProviders: AuthProvider[]) {}

  async signup(auth: Auth): Promise<UserEntity> {
    const authProvider = this.findProvider(auth);
    return authProvider.signup(auth);
  }

  async authenticate(auth: Auth): Promise<AuthUser> {
    const authProvider = this.findProvider(auth);
    return authProvider.authenticate(auth);
  }

  private findProvider(auth: Auth): AuthProvider {
    const authProvider = this.authProviders.find((provider) => provider.isSupport(auth));

    if (!authProvider) {
      throw new InvalidAuthenticationMethodException(`Could not find auth provider ${auth.constructor.name}`);
    }

    return authProvider;
  }
}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_AUTHENTICATION_METHOD' })
export class InvalidAuthenticationMethodException extends Error {}
