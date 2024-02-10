import { Injectable } from '@nestjs/common';
import { Hash } from '../../../../common/hash';
import { Email } from '../../../../common/types';
import { UsersService } from '../../../../users/application/users.service';
import { UserEntity } from '../../../../users/domain/entities/user.entity';
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
import { EmailPasswordSignup } from './identifier-password-signup';

@Injectable()
export class IdentifierPasswordAuthProvider implements AuthProvider {
  constructor(
    private readonly notificationSender: AuthenticationNotifier,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async signup(data: EmailPasswordSignup): Promise<UserEntity> {
    const registeredUser = await this.findUser(data.email);
    if (registeredUser) {
      throw new UserAlreadyRegisteredException();
    }

    const createdUser = await this.usersService.create({
      email: data.email,
      isEmailVerified: false,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });

    await this.sendEmailVerificationOtp(data.email);

    return createdUser;
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
    return auth instanceof EmailPasswordSignup || auth instanceof IdentifierPasswordAuth;
  }

  private async findUser(identifier: string): Promise<UserEntity | null> {
    return await this.usersService.findOneByIdentifier(identifier);
  }

  private async isPasswordMatchInBCRYPT(auth: IdentifierPasswordAuth, hash: string): Promise<void> {
    const isPasswordsMatch = await Hash.compare(auth.password, hash);

    if (!isPasswordsMatch) {
      throw new InvalidCredentialException(`Passwords mismatch for ${auth.identifier}`);
    }
  }

  private async sendEmailVerificationOtp(email: Email) {
    const otpGeneration = OtpGeneration.ofEmail(email, email, OTPType.CODE, OTPReason.VERIFY, CODE_EXPIRATION_DURATION);
    const otp = await this.otpService.generate(otpGeneration);
    await this.notificationSender.sendOtp(otpGeneration, otp);
  }
}
