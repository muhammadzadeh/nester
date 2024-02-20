import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile } from '../../../../common/types';

export class SigninByPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly password!: string;
}
