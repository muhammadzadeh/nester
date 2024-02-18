import { Injectable } from '@nestjs/common';
import { Email, Mobile } from '../../../../common/types';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { Auth, AuthProvider, AuthProviderType, AuthUser, InvalidOtpException } from '../../../application/services/auth-provider';
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

    let createdUser: UserEntity | undefined = undefined;
    if (data.isEmail()) {
      createdUser = await this.SignupByEmail(data.identifier);
    } else {
      createdUser = await this.SignupByMobile(data.identifier);
    }

    return createdUser!;
  }

  async authenticate(auth: OtpAuth): Promise<AuthUser> {
    const { userId } = await this.verify(auth);
    const user = await this.findUser(userId);
    if (!user) {
      throw new InvalidOtpException(`User with ${userId} not found`);
    }

    return new AuthUser(
      userId,
      AuthProviderType.OTP,
      user.email!,
      user.mobile!,
      user.firstName,
      user.lastName,
      user.avatar,
      auth.email ? user.isEmailVerified : undefined,
      auth.mobile ? user.isMobileVerified : undefined,
    );
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
    const createdUser = await this.usersService.create({
      email: email,
      isEmailVerified: false,
    });
    await this.sendEmailVerificationOtp(createdUser, email);
    return createdUser;
  }

  private async SignupByMobile(mobile: Mobile): Promise<UserEntity> {
    const createdUser = await this.usersService.create({
      mobile: mobile,
      isMobileVerified: false,
    });
    await this.sendMobileVerificationOtp(createdUser, mobile);
    return createdUser;
  }

  private async sendMobileVerificationOtp(user: UserEntity, mobile: Mobile) {
    const otpGeneration = OtpGeneration.ofMobile(
      user.id,
      mobile,
      OTPType.CODE,
      OTPReason.VERIFY,
      CODE_EXPIRATION_DURATION,
    );
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }

  private async sendEmailVerificationOtp(user: UserEntity, email: Email) {
    const otpGeneration = OtpGeneration.ofEmail(
      user.id,
      email,
      OTPType.CODE,
      OTPReason.VERIFY,
      CODE_EXPIRATION_DURATION,
    );
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
