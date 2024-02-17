import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheServiceModule } from '../../common/cache/cache.module';
import { Configuration } from '../../common/config';
import { IsStrongPasswordConstraint } from '../../common/is-strong-password.validator';
import { UsersService } from '../../users/profiles/application/users.service';
import { ProfileModule } from '../../users/profiles/infrastructure/profiles.module';
import { RolesModule } from '../../users/roles/infrastructure/roles.module';
import { PasswordService } from '../application';
import { AuthProviderManager, AuthService, AuthenticationNotifier, JwtTokenService, OtpService } from '../application/';
import { AuthProvider } from '../application/providers/auth-provider.interface';
import { PROVIDER_MANAGER } from '../application/providers/provider-manager.interface';
import { OTP_REPOSITORY_TOKEN } from '../domain/repositories';
import { TypeormOTPEntity } from './database/entities';
import { TypeOrmOTPRepository } from './database/repositories';
import { FacebookAuthProvider } from './providers/facebook';
import { FakeAuthProvider } from './providers/fake';
import { GoogleAuthProvider } from './providers/google';
import { IdentifierPasswordAuthProvider } from './providers/identified-password';
import { LinkedinAuthProvider } from './providers/linkedin';
import { OTPAuthProvider } from './providers/otp';
import { AuthenticationController } from './web';
import { AuthorizationGuard, CheckPermissionGuard, IsUserEnableGuard } from './web/guards';

const authProviderManager: Provider = {
  provide: PROVIDER_MANAGER,
  inject: [AuthenticationNotifier, Configuration, UsersService, OtpService],
  useFactory: (
    notificationSender: AuthenticationNotifier,
    configuration: Configuration,
    usersService: UsersService,
    otpService: OtpService,
  ) => {
    const authProviders: AuthProvider[] = [
      new IdentifierPasswordAuthProvider(notificationSender, configuration, usersService, otpService),
      new FacebookAuthProvider(),
      new LinkedinAuthProvider(),
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
    IdentifierPasswordAuthProvider,
    FacebookAuthProvider,
    LinkedinAuthProvider,
    GoogleAuthProvider,
    OTPAuthProvider,
    AuthenticationNotifier,
    JwtTokenService,
    PasswordService,
    FakeAuthProvider,
    AuthorizationGuard,
    CheckPermissionGuard,
    IsUserEnableGuard,
    {
      provide: IsStrongPasswordConstraint,
      inject: [Configuration],
      useFactory: (config: Configuration) => new IsStrongPasswordConstraint(config),
    },
  ],
  exports: [OtpService, AuthService, JwtTokenService],
})
export class AuthenticationModule {}
