import { Injectable } from '@nestjs/common';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { Configuration } from '../../../../common/config';
import { publish } from '../../../../common/rabbit/application/rabbit-mq.service';
import { Email } from '../../../../common/types';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { UserAlreadyRegisteredException } from '../../../application';
import { AuthProviderType } from '../../../application/providers/auth-provider.enum';
import { Auth, AuthProvider } from '../../../application/providers/auth-provider.interface';
import { AuthUser } from '../../../application/providers/auth-user';
import { InvalidCredentialException } from '../../../application/providers/invalid-credentials.exception';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../../domain/constants';
import { AuthenticationEvents, UserVerifiedEvent } from '../../../domain/events';
import { GoogleAuth } from './google-auth';
import { GoogleSignup } from './google-signup';

@Injectable()
export class GoogleAuthProvider implements AuthProvider {
  constructor(
    private readonly configuration: Configuration,
    private readonly usersService: UsersService,
  ) {}

  async signup(data: GoogleSignup): Promise<UserEntity> {
    const authUser = await this.authenticate(data);

    const registeredUser = await this.findUser(authUser.email!);
    if (registeredUser) {
      throw new UserAlreadyRegisteredException();
    }

    const createdUser = await this.usersService.create({
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      email: authUser.email!.toLowerCase(),
      isEmailVerified: true,
      avatar: authUser.picture,
    });

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_VERIFIED, new UserVerifiedEvent(createdUser), {
      persistent: true,
      deliveryMode: 2,
    });

    return createdUser;
  }

  async authenticate({ token }: GoogleAuth): Promise<AuthUser> {
    const ticket = await this.verifyToken(token);
    const payload = ticket.getPayload();

    if (!payload) {
      throw new InvalidCredentialException('Illegal state, given payload is null');
    }

    return {
      provider: AuthProviderType.GOOGLE,
      providerId: payload.sub,
      email: payload.email!,
      mobile: null,
      picture: payload.picture ?? null,
      firstName: payload.given_name ?? null,
      lastName: payload.family_name ?? null,
      isVerified: true,
    };
  }

  isSupport(auth: Auth): boolean {
    return auth instanceof GoogleSignup || auth instanceof GoogleAuth;
  }

  private async findUser(identifier: Email): Promise<UserEntity | null> {
    return await this.usersService.findOneByIdentifier(identifier);
  }

  private async verifyToken(token: string): Promise<LoginTicket> {
    try {
      const googleConfig = this.configuration.google;

      const client = new OAuth2Client(googleConfig.clientId, googleConfig.clientSecret);

      return await client.verifyIdToken({
        idToken: token,
        audience: googleConfig.clientId,
      });
    } catch (error) {
      throw new InvalidCredentialException('Google authentication failed', { cause: error });
    }
  }
}
