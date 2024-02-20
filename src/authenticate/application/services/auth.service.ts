import { Injectable, Logger } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Duration } from 'luxon';
import { publish } from '../../../common/rabbit/application/rabbit-mq.service';
import { Email, Mobile, UserId, Username } from '../../../common/types';
import { UsersService } from '../../../users/profiles/application/users.service';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../users/roles/application/roles.service';
import { Permission } from '../../../users/roles/domain/entities/role.entity';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../domain/constants';
import { OTPType } from '../../domain/entities';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../domain/events';
import { UserNotRegisteredException, YourAccountIsBlockedException } from '../exceptions';
import { RequestResetPasswordCommand } from '../usecases/request-reset-password/request-reset-password.command';
import { RequestResetPasswordUsecase } from '../usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordCommand } from '../usecases/reset-password/reset-password.command';
import { ResetPasswordUsecase } from '../usecases/reset-password/reset-password.usecase';
import { SendOtpCommand } from '../usecases/send-otp/send-otp.command';
import { SendOtpUsecase } from '../usecases/send-otp/send-otp.usecase';
import { SigninByOtpCommand } from '../usecases/signin-by-otp/signin-by-otp';
import { SigninByOtpUsecase } from '../usecases/signin-by-otp/signin-by-otp.usecase';
import { SignupByOtpCommand } from '../usecases/signup-by-otp/signup-by-otp.command';
import { SignupByOtpUsecase } from '../usecases/signup-by-otp/signup-by-otp.usecase';
import { VerifyCommand } from '../usecases/verify/verify.command';
import { VerifyUsecase } from '../usecases/verify/verify.usecase';
import { Auth, AuthUser } from './auth-provider';
import { AuthProviderManager } from './auth-provider-manager';
import { AccessType, JwtTokenService, RevokeTokenOption, Token } from './jwt-token.service';
import { OtpVerification } from './otp.service';
import { SigninByPasswordUsecase } from '../usecases/signin-by-password/signin-by-password.usecase';
import { SigninByPasswordCommand } from '../usecases/signin-by-password/signin-by-password';
import { SignupByPasswordCommand } from '../usecases/signup-by-password/signup-by-password.command';
import { SignupByPasswordUsecase } from '../usecases/signup-by-password/signup-by-password.usecase';
import { ImpersonationUsecase } from '../usecases/impersonation/impersonation.usercase';
import { ImpersonationCommand } from '../usecases/impersonation/impersonation.command';

export const TOKEN_EXPIRATION_DURATION = Duration.fromObject({ days: 1 });
export const CODE_EXPIRATION_DURATION = Duration.fromObject({ minutes: 2 });

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly requestResetPasswordUsecase: RequestResetPasswordUsecase,
    private readonly signinByPasswordUsecase: SigninByPasswordUsecase,
    private readonly signupByPasswordUsecase: SignupByPasswordUsecase,
    private readonly impersonationUsecase: ImpersonationUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly signinByOtpUsecase: SigninByOtpUsecase,
    private readonly signupByOtpUsecase: SignupByOtpUsecase,
    private readonly authManager: AuthProviderManager,
    private readonly sendOtpUsecase: SendOtpUsecase,
    private readonly tokenService: JwtTokenService,
    private readonly verifyUsecase: VerifyUsecase,
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

  async signinByPassword(data: SigninByPasswordData): Promise<Token> {
    return await this.signinByPasswordUsecase.execute(SigninByPasswordCommand.create(data));
  }

  async signinByOtp(data: SigninByOtpData): Promise<Token> {
    return await this.signinByOtpUsecase.execute(SigninByOtpCommand.create(data));
  }

  async impersonation(data: ImpersonationData): Promise<Token> {
    return await this.impersonationUsecase.execute(ImpersonationCommand.create(data));
  }

  async signupByOtp(data: SignupByOtpData): Promise<void> {
    await this.signupByOtpUsecase.execute(SignupByOtpCommand.create(data));
  }

  async signupByPassword(data: SignupByPasswordData): Promise<void> {
    await this.signupByPasswordUsecase.execute(SignupByPasswordCommand.create(data));
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

  async verify(data: VerifyData): Promise<Token> {
    return await this.verifyUsecase.execute(VerifyCommand.create(data));
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

export class VerifyData {
  readonly otp!: string;
  readonly type!: OTPType;
  readonly identifier!: Email | Mobile;
}

export class SigninByOtpData {
  readonly otp!: string;
  readonly type!: OTPType;
  readonly identifier!: Email | Mobile;
}

export class ImpersonationData {
  readonly identifier!: Email | Mobile | UserId | Username;
}

export class SigninByPasswordData {
  readonly password!: string;
  readonly identifier!: Email | Mobile;
}

export class SignupByPasswordData {
  readonly password!: string;
  readonly identifier!: Email | Mobile;
}

export class SignupByOtpData {
  readonly identifier!: Email | Mobile;
}

export enum SigninMethod {
  PASSWORD = 'password',
  OTP = 'otp',
  CALL = 'call',
}
