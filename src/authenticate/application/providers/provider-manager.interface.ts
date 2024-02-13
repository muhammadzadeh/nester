import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { Auth } from './auth-provider.interface';
import { AuthUser } from './auth-user';

export const PROVIDER_MANAGER = Symbol('ProviderManager');

export interface ProviderManager {
  authenticate(auth: Auth): Promise<AuthUser>;
  signup(auth: Auth): Promise<UserEntity>;
}
