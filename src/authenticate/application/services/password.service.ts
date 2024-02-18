import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/profiles/application/users.service';
import { OtpService, OtpVerification } from './otp.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async resetPassword(otpVerification: OtpVerification, password: string): Promise<void> {
    const { userId } = await this.otpService.verify(otpVerification);
    await this.usersService.updatePassword(userId, password);
  }
}
