import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheServiceModule } from '../../common/cache/cache.module';
import { Configuration } from '../../common/config';
import { IsStrongPasswordConstraint } from '../../common/is-strong-password.validator';
import { UsersService } from '../../users/profiles/application/users.service';
import { ProfileModule } from '../../users/profiles/infrastructure/profiles.module';
import { RolesModule } from '../../users/roles/infrastructure/roles.module';
import { AuthProviderManager } from '../application';
import { AuthService, AuthenticationNotifier, JwtTokenService, OtpService } from '../application/';
import { AuthProvider } from '../application/services/auth-provider';
import { RequestResetPasswordUsecase } from '../application/usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordUsecase } from '../application/usecases/reset-password/reset-password.usecase';
import { OTP_REPOSITORY_TOKEN } from '../domain/repositories';
import { TypeormOTPEntity } from './database/entities';
import { TypeOrmOTPRepository } from './database/repositories';
import { FakeAuthProvider } from './providers/fake';
import { GoogleAuthProvider } from './providers/google';
import { IdentifierPasswordAuthProvider } from './providers/identified-password';
import { OTPAuthProvider } from './providers/otp';
import { AuthenticationController } from './web';
import { AuthorizationGuard, CheckPermissionGuard, IsUserEnableGuard } from './web/guards';
import { SendOtpUsecase } from '../application/usecases/send-otp/send-otp.usecase';

const authProviderManager: Provider = {
  provide: AuthProviderManager,
  inject: [AuthenticationNotifier, Configuration, UsersService, OtpService],
  useFactory: (
    notificationSender: AuthenticationNotifier,
    configuration: Configuration,
    usersService: UsersService,
    otpService: OtpService,
  ) => {
    const authProviders: AuthProvider[] = [
      new IdentifierPasswordAuthProvider(notificationSender, configuration, usersService, otpService),
      new GoogleAuthProvider(configuration, usersService),
      new FakeAuthProvider(configuration, usersService),
      new OTPAuthProvider(notificationSender, usersService, otpService),
    ];

    return new AuthProviderManager(authProviders);
  },
};

const otpRepository: Provider = {
  provide: OTP_REPOSITORY_TOKEN,
  useClass: TypeOrmOTPRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormOTPEntity]), CacheServiceModule, ProfileModule, RolesModule],
  controllers: [AuthenticationController],
  providers: [
    authProviderManager,
    otpRepository,
    AuthService,
    OtpService,
    AuthenticationNotifier,
    JwtTokenService,
    AuthorizationGuard,
    CheckPermissionGuard,
    IsUserEnableGuard,
    RequestResetPasswordUsecase,
    ResetPasswordUsecase,
    SendOtpUsecase,
    {
      provide: IsStrongPasswordConstraint,
      inject: [Configuration],
      useFactory: (config: Configuration) => new IsStrongPasswordConstraint(config),
    },
  ],
  exports: [OtpService, AuthService, JwtTokenService],
})
export class AuthenticationModule {}
