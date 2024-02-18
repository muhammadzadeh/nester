import { BaseCommand } from '../../../../common/commands/base.command';
import { Email, Mobile } from '../../../../common/types';
import { OTPType } from '../../../domain/entities';

export class SendOtpCommand extends BaseCommand {
  readonly identifier!: Email | Mobile;
  readonly type!: OTPType;
}
