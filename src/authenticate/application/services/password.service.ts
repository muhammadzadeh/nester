import { Injectable } from '@nestjs/common';
import { Email } from '../../../common/types';
import { UsersService } from '../../../users/application/users.service';
import { OTPReason, OTPType } from '../../domain/entities';
import { AuthenticationNotifier } from './authentication.notifier';
import { OtpGeneration, OtpService, OtpVerification } from './otp.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}
  async sendResetPasswordLink(email: Email): Promise<void> {
    const user = await this.usersService.findOneByIdentifierOrFail(email);

    const otpGeneration = OtpGeneration.ofEmail(user.id, user.email!, OTPType.TOKEN, OTPReason.RESET_PASSWORD);
    const otp = await this.otpService.generate(otpGeneration);

    await this.notificationSender.sendOtp(otpGeneration, otp);
  }

  async resetPassword(otpVerification: OtpVerification, password: string): Promise<void> {
    const { userId } = await this.otpService.verify(otpVerification);
    await this.usersService.updatePassword(userId, password);
  }
}
