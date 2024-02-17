import { Injectable } from '@nestjs/common';
import { Configuration } from '../../../../common/config';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { AuthProviderType } from '../../../application/providers/auth-provider.enum';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { InvalidCredentialException } from '../../../application/providers/invalid-credentials.exception';
import { FakeAuth } from './fake-auth';
import { FakeSignup } from './fake-signup';

@Injectable()
export class FakeAuthProvider implements AuthProvider {
  constructor(
    private readonly configuration: Configuration,
    private readonly usersService: UsersService,
  ) {}

  async signup(data: FakeSignup): Promise<UserEntity> {
    throw data;
  }

  async authenticate(auth: FakeAuth): Promise<AuthUser> {
    if (!this.configuration.debug) {
      throw new InvalidCredentialException(`Fake auth is only available in debug mode, ${auth.identifier}`);
    }

    const user = await this.findUser(auth.identifier);

    return new AuthUser(
      user.id,
      AuthProviderType.Fake,
      user.email!,
      user.mobile!,
      user.firstName,
      user.lastName,
      user.avatar,
      user.isEmailVerified,
      user.isMobileVerified,
    );
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof FakeSignup || auth instanceof FakeAuth;
  }

  private async findUser(identifier: string): Promise<UserEntity> {
    try {
      return await this.usersService.findOneByIdentifierOrFail(identifier);
    } catch (error) {
      throw new InvalidCredentialException(`User with ${identifier} not found`, { cause: error });
    }
  }
}
