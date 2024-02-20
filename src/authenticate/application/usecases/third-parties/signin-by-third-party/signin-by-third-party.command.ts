
import { BaseCommand } from '../../../../../common/commands/base.command';
import { Auth, AuthProviderType } from '../auth-provider';

export class SigninByThirdPartyCommand extends BaseCommand {
  readonly provider!: AuthProviderType;
  readonly data!: Auth;
}
