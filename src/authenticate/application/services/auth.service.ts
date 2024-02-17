import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Duration } from 'luxon';
import { Exception } from '../../../common/exception';
import { publish } from '../../../common/rabbit/application/rabbit-mq.service';
import { Email, Mobile } from '../../../common/types';
import { UsersService } from '../../../users/profiles/application/users.service';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../users/roles/application/roles.service';
import { Permission } from '../../../users/roles/domain/entities/role.entity';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../domain/constants';
import { OTPReason, OTPType } from '../../domain/entities';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../domain/events';
import { Auth } from '../providers/auth-provider.interface';
import { AuthUser } from '../providers/auth-user';
import { PROVIDER_MANAGER, ProviderManager } from '../providers/provider-manager.interface';
import { AuthenticationNotifier } from './authentication.notifier';
import { AccessType, JwtTokenService, RevokeTokenOption, Token } from './jwt-token.service';
import { OtpGeneration, OtpService } from './otp.service';

export const TOKEN_EXPIRATION_DURATION = Duration.fromObject({ days: 1 });
export const CODE_EXPIRATION_DURATION = Duration.fromObject({ minutes: 2 });

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @Inject(PROVIDER_MANAGER) private readonly authManager: ProviderManager,
    private readonly notificationSender: AuthenticationNotifier,
    private readonly tokenService: JwtTokenService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  async getAuthenticateMethods(identifier: Email | Mobile): Promise<SigninMethod[]> {
    const user = await this.findUser(identifier);
    const signinMethods: SigninMethod[] = [];

    signinMethods.push(SigninMethod.OTP);
    if (user.hashPassword()) {
      signinMethods.push(SigninMethod.PASSWORD);
    }

    return signinMethods;
  }

  async signup(data: Auth): Promise<Token | undefined> {
    const registeredUser: UserEntity = await this.authManager.signup(data);

    if (registeredUser.isVerified()) {
      return await this.generateToken(registeredUser);
    }

    return undefined;
  }

  async authenticate(auth: Auth): Promise<Token> {
    const authUser: AuthUser = await this.authManager.authenticate(auth);
    const user = await this.usersService.findOneByIdentifierOrFail(authUser.email ?? authUser.mobile!);

    if (!user.isVerified() && authUser.isVerified()) {
      //CHECK why is verified is not working
      if (authUser.isEmailVerified) {
        user.isEmailVerified = authUser.isEmailVerified;
      }

      if (authUser.isMobileVerified) {
        user.isMobileVerified = authUser.isMobileVerified;
      }

      publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_VERIFIED, new UserVerifiedEvent(user), {
        persistent: true,
        deliveryMode: 2,
      });
    }

    if (user.isBlocked) {
      throw new YourAccountIsBlockedException();
    }

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_LOGGED_IN, new UserLoggedInEvent(user), {
      persistent: true,
      deliveryMode: 2,
    });

    return this.generateToken(user);
  }

  async revokeToken(options: RevokeTokenOption): Promise<void> {
    await this.tokenService.revokeToken(options);
  }

  async sendOtp(data: SendOtp): Promise<void> {
    const user = await this.findUser(data.identifier);

    if (data.isEmail()) {
      await this.sendEmailVerificationOtp(user, data.identifier);
    } else {
      await this.sendMobileVerificationOtp(user, data.identifier);
    }
  }

  private async generateToken(user: UserEntity): Promise<Token> {
    const permissions = await this.findUserPermissions(user);
    return await this.tokenService.generate({
      accessType: user.isVerified() ? AccessType.VERIFIED_USER : AccessType.UNVERIFIED_USER,
      email: user.email,
      mobile: user.mobile,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      userId: user.id,
      isBlocked: user.isBlocked,
      permissions,
    });
  }

  private async findUserPermissions(user: UserEntity): Promise<Permission[]> {
    const permissions: Permission[] = [];
    if (!user.hasRole()) {
      return permissions;
    }

    try {
      const role = await this.rolesService.findOneById(user.roleId!);
      permissions.push(...role.permissions);
    } catch (error) {
      this.logger.error(error);
    }
    return permissions;
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

  private async findUser(identifier: Mobile | Email): Promise<UserEntity> {
    try {
      return await this.usersService.findOneByIdentifierOrFail(identifier);
    } catch (error) {
      throw new UserNotRegisteredException('User not registered', { cause: error });
    }
  }
}

export class SendOtp {
  constructor(
    readonly identifier: Email | Mobile,
    readonly type: OTPType,
  ) {}

  isEmail(): boolean {
    return isEmail(this.identifier);
  }
}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_NOT_REGISTERED' })
export class UserNotRegisteredException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_ALREADY_REGISTERED' })
export class UserAlreadyRegisteredException extends Error {}

@Exception({
  errorCode: 'ACCOUNT_IS_BLOCKED',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class YourAccountIsBlockedException extends Error {}

export enum SigninMethod {
  PASSWORD = 'password',
  OTP = 'otp',
  CALL = 'call',
}
