import { BaseCommand } from '@repo/types';
import { OtpVerification } from '../../services/otp.service';

export class ResetPasswordCommand extends BaseCommand {
  readonly otpData!: OtpVerification;
  readonly password!: string;
}
