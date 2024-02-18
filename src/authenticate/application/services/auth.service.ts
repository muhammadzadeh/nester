import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { OTPType } from '../../domain/entities';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../domain/events';
import { RequestResetPasswordCommand } from '../usecases/request-reset-password/request-reset-password.command';
import { RequestResetPasswordUsecase } from '../usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordCommand } from '../usecases/reset-password/reset-password.command';
import { ResetPasswordUsecase } from '../usecases/reset-password/reset-password.usecase';
import { SendOtpCommand } from '../usecases/send-otp/send-otp.command';
import { SendOtpUsecase } from '../usecases/send-otp/send-otp.usecase';
import { Auth, AuthUser } from './auth-provider';
import { AuthProviderManager } from './auth-provider-manager';
import { AccessType, JwtTokenService, RevokeTokenOption, Token } from './jwt-token.service';
import { OtpVerification } from './otp.service';

export const TOKEN_EXPIRATION_DURATION = Duration.fromObject({ days: 1 });
export const CODE_EXPIRATION_DURATION = Duration.fromObject({ minutes: 2 });

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly requestResetPasswordUsecase: RequestResetPasswordUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly authManager: AuthProviderManager,
    private readonly sendOtpUsecase: SendOtpUsecase,
    private readonly tokenService: JwtTokenService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
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
    await this.sendOtpUsecase.execute(SendOtpCommand.create(data));
  }

  async requestResetPassword(identifier: Email | Mobile): Promise<void> {
    await this.requestResetPasswordUsecase.execute(
      RequestResetPasswordCommand.create({
        identifier,
      }),
    );
  }

  async resetPassword(otpVerification: OtpVerification, password: string): Promise<void> {
    await this.resetPasswordUsecase.execute(
      ResetPasswordCommand.create({
        otpData: otpVerification,
        password,
      }),
    );
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
