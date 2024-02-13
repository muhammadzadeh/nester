import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { LinkedinAuth } from './linkedin-auth';
import { LinkedinSignup } from './linkedin-signup';

@Injectable()
export class LinkedinAuthProvider implements AuthProvider {
  async signup(data: LinkedinSignup): Promise<UserEntity> {
    throw data;
  }
  async authenticate(auth: LinkedinAuth): Promise<AuthUser> {
    throw { ...auth, message: 'not implemented!' };
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof LinkedinSignup || auth instanceof LinkedinAuth;
  }
}
