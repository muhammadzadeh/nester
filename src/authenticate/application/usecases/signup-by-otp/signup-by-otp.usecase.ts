import { Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { OTPReason, OTPType } from '../../../domain/entities';
import { UserAlreadyRegisteredException } from '../../../domain/exceptions';
import { AuthenticationNotifier, OtpGeneration, OtpService } from '../../services';
import { SignupByOtpCommand } from './signup-by-otp.command';

@Injectable()
export class SignupByOtpUsecase {
  private readonly logger = new Logger(SignupByOtpUsecase.name);

  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: SignupByOtpCommand): Promise<void> {
    const user = await this.usersService.findOneByIdentifier(command.identifier);
    if (user) {
      throw new UserAlreadyRegisteredException(`User with identifier ${command.identifier} already exists.`);
    }

    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile || !email) {
      this.logger.log(`Email or password is  missing for identifier ${command.identifier}`);
      return;
    }

    const otpGeneration = new OtpGeneration(user.id, email, mobile, OTPType.CODE, OTPReason.VERIFY);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
