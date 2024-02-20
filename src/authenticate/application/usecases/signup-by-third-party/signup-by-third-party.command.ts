import { BaseCommand } from '../../../../common/commands/base.command';
import { Auth, AuthProviderType } from './auth-provider';

export class SignupByThirdPartyCommand extends BaseCommand {
  readonly provider!: AuthProviderType;
  readonly data!: Auth;
}
