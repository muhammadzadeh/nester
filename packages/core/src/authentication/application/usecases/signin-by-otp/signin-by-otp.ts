import { BaseCommand } from '../../../../common/commands/base.command';
import { OTPType } from '../../../domain/entities';

export class SigninByOtpCommand extends BaseCommand {
  readonly otp!: string;
  readonly type!: OTPType;
  readonly identifier!: string;
}
