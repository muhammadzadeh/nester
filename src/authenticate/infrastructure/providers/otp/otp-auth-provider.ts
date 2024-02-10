import { Injectable } from '@nestjs/common';
import { Email, Mobile } from '../../../../common/types';
import { UsersService } from '../../../../users/application/users.service';
import { UserEntity } from '../../../../users/domain/entities/user.entity';
import { AuthProviderType } from '../../../application/providers/auth-provider.enum';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { InvalidOtpException } from '../../../application/providers/invalid-credentials.exception';
import {
  AuthenticationNotifier,
  CODE_EXPIRATION_DURATION,
  OTPVerificationResult,
  OtpGeneration,
  OtpService,
  UserAlreadyRegisteredException,
} from '../../../application/services';
import { OTPReason, OTPType } from '../../../domain/entities';
import { OtpAuth } from './otp-auth';
import { OtpSignup } from './otp-signup';

@Injectable()
export class OTPAuthProvider implements AuthProvider {
  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}
  async signup(data: OtpSignup): Promise<UserEntity> {
    const registeredUser = await this.findUser(data.identifier);
    if (registeredUser) {
      throw new UserAlreadyRegisteredException();
    }

    const createdUser: UserEntity | undefined = undefined;
    if (data.isEmail()) {
      await this.SignupByEmail(data.identifier);
    } else {
      await this.SignupByMobile(data.identifier);
    }

    return createdUser!;
  }

  async authenticate(auth: OtpAuth): Promise<AuthUser> {
    const { userId } = await this.verify(auth);
    const user = await this.findUser(userId);
    if (!user) {
      throw new InvalidOtpException(`User with ${userId} not found`);
    }

    return {
      provider: AuthProviderType.OTP,
      providerId: userId,
      email: user.email!,
      mobile: user.mobile!,
      picture: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: true,
    };
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof OtpSignup || auth instanceof OtpAuth;
  }

  private async verify(auth: OtpAuth): Promise<OTPVerificationResult> {
    try {
      return await this.otpService.verify(auth);
    } catch (error: any) {
      throw new InvalidOtpException('OTP verification failed!', { cause: error });
    }
  }

  private async findUser(identifier: Email | Mobile): Promise<UserEntity | null> {
    return await this.usersService.findOneByIdentifier(identifier);
  }

  private async SignupByEmail(email: Email): Promise<UserEntity> {
    await this.sendEmailVerificationOtp(email);

    return await this.usersService.create({
      email: email,
      isEmailVerified: false,
    });
  }

  private async SignupByMobile(mobile: Mobile): Promise<UserEntity> {
    await this.sendMobileVerificationOtp(mobile);

    return await this.usersService.create({
      mobile: mobile,
      isMobileVerified: false,
    });
  }

  private async sendMobileVerificationOtp(mobile: Mobile) {
    const otpGeneration = OtpGeneration.ofMobile(
      mobile,
      mobile,
      OTPType.CODE,
      OTPReason.VERIFY,
      CODE_EXPIRATION_DURATION,
    );
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }

  private async sendEmailVerificationOtp(email: Email) {
    const otpGeneration = OtpGeneration.ofEmail(email, email, OTPType.CODE, OTPReason.VERIFY, CODE_EXPIRATION_DURATION);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
