import { Injectable } from '@nestjs/common';
import { Hash } from '../../../../common/hash';
import { Email, Mobile, UserId, Username } from '../../../../common/types';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import {
  AuthenticationNotifier,
  CODE_EXPIRATION_DURATION,
  OtpGeneration,
  OtpService,
  UserAlreadyRegisteredException,
} from '../../../application';
import { AuthProviderType } from '../../../application/providers/auth-provider.enum';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { InvalidCredentialException } from '../../../application/providers/invalid-credentials.exception';
import { OTPReason, OTPType } from '../../../domain/entities';
import { IdentifierPasswordAuth } from './identifier-password-auth';
import { IdentifierPasswordSignup } from './identifier-password-signup';

@Injectable()
export class IdentifierPasswordAuthProvider implements AuthProvider {
  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async signup(data: IdentifierPasswordSignup): Promise<UserEntity> {
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

  async authenticate(auth: IdentifierPasswordAuth): Promise<AuthUser> {
    const user = await this.findUser(auth.identifier);
    if (!user) {
      throw new InvalidCredentialException(`User with ${auth.identifier} not found`);
    }

    if (!user.password) {
      throw new InvalidCredentialException(`User with ${auth.identifier} has no password`);
    }

    await this.isPasswordMatchInBCRYPT(auth, user.password);

    return {
      provider: AuthProviderType.IDENTIFIER,
      providerId: user.id,
      email: user.email!,
      mobile: user.mobile!,
      picture: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified(),
    };
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof IdentifierPasswordSignup || auth instanceof IdentifierPasswordAuth;
  }

  private async findUser(identifier: Email | Mobile | Username | UserId): Promise<UserEntity | null> {
    return await this.usersService.findOneByIdentifier(identifier);
  }

  private async isPasswordMatchInBCRYPT(auth: IdentifierPasswordAuth, hash: string): Promise<void> {
    const isPasswordsMatch = await Hash.compare(auth.password, hash);

    if (!isPasswordsMatch) {
      throw new InvalidCredentialException(`Passwords mismatch for ${auth.identifier}`);
    }
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
