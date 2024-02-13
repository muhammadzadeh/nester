import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { AuthUser } from './auth-user';

export interface AuthProvider {
  authenticate(data: Auth): Promise<AuthUser>;
  signup(data: Auth): Promise<UserEntity>
  isSupport(auth: Auth): boolean;
}

export interface Auth {}
