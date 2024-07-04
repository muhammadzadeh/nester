import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile } from '../../../../common/types';

export class SignupByOtpCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
}
