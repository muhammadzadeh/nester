import { BaseCommand } from '../../../../common/commands/base.command';
import { OtpVerification } from '../../services/otp.service';

export class ResetPasswordCommand extends BaseCommand {
  readonly otpData!: OtpVerification;
  readonly password!: string;
}
