import { Injectable } from '@nestjs/common';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../../authenticate/domain/constants';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../../authenticate/domain/events';
import { OnRabbitEvent } from '../../../common/rabbit/application/decorators';
import { UsersService } from './users.service';

@Injectable()
export class UsersConsumer {
  constructor(private readonly usersService: UsersService) {}

  @OnRabbitEvent({
    exchange: AUTHENTICATION_EXCHANGE_NAME,
    routingKey: AuthenticationEvents.USER_VERIFIED,
    queue: 'users_user_verified',
  })
  async markUserAsVerified(event: UserVerifiedEvent): Promise<void> {
    await this.usersService.markUserAsVerified(event.user);
  }

  @OnRabbitEvent({
    exchange: AUTHENTICATION_EXCHANGE_NAME,
    routingKey: AuthenticationEvents.USER_LOGGED_IN,
    queue: 'users_user_logged_in',
  })
  async updateLoggedInTime(event: UserLoggedInEvent): Promise<void> {
    await this.usersService.updateLoggedInTime(event.user);
  }
}
