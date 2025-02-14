
import { BaseCommand } from '@repo/types';
import { Auth, AuthProviderType } from '../auth-provider';

export class SigninByThirdPartyCommand extends BaseCommand {
  readonly provider!: AuthProviderType;
  readonly data!: Auth;
}
