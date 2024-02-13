import { Injectable } from '@nestjs/common';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { FacebookAuth } from './facebook-auth';
import { FacebookSignup } from './facebook-signup';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';

@Injectable()
export class FacebookAuthProvider implements AuthProvider {
  async signup(data: FacebookSignup): Promise<UserEntity> {
    throw data;
  }

  async authenticate(auth: FacebookAuth): Promise<AuthUser> {
    throw { ...auth, message: 'not implemented!' };
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof FacebookSignup || auth instanceof FacebookAuth;
  }
} 
