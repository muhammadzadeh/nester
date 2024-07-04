import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile } from '../../../../common/types';

export class RequestResetPasswordCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
}
