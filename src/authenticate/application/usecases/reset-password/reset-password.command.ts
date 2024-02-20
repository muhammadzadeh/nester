import { OtpVerification } from '../../services';
import { BaseCommand } from '../../../../common/commands/base.command';

export class ResetPasswordCommand extends BaseCommand {
  readonly otpData!: OtpVerification;
  readonly password!: string;
}
