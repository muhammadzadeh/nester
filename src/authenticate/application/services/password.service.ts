import { OtpGeneration, OtpService, OtpVerification } from './otp.service';
import { OTPReason, OTPType } from '../../domain/entities';
import { AuthenticationNotifier } from './authentication.notifier';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/application/users.service';
import { Email } from '../../../common/types';

@Injectable()
export class PasswordService {
  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}
  async sendResetPasswordLink(email: Email) {
    const profile = await this.usersService.findOneByIdentifierOrFail(email);

    const otpGeneration = OtpGeneration.ofEmail(profile.id, profile.email!, OTPType.TOKEN, OTPReason.RESET_PASSWORD);
    const otp = await this.otpService.generate(otpGeneration);

    await this.notificationSender.sendOtp(otpGeneration, otp);
  }

  async resetPassword(otpVerification: OtpVerification, password: string) {
    const { userId } = await this.otpService.verify(otpVerification);
    await this.usersService.updatePassword(userId, password);
  }
}
