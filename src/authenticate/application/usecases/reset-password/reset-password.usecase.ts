import { Injectable } from '@nestjs/common';
import { OtpService } from '../..';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { ResetPasswordCommand } from './reset-password.command';

@Injectable()
export class ResetPasswordUsecase {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { userId } = await this.otpService.verify(command.otpData);
    await this.usersService.updatePassword(userId, command.password);
  }
}
