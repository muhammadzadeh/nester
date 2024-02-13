import { Injectable } from '@nestjs/common';
import { Auth, AuthProvider } from './auth-provider.interface';
import { AuthUser } from './auth-user';
import { InvalidAuthenticationMethodException } from './invalid-authentication-method.exception';
import { ProviderManager } from './provider-manager.interface';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';

@Injectable()
export class AuthProviderManager implements ProviderManager {
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
