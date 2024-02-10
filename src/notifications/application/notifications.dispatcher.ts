import { Injectable, Logger } from '@nestjs/common';
import { EmailChannelDispatcher } from './dispatchers';
import { NotificationEntity } from '../domain/entities/notification.entity';

@Injectable()
export class NotificationsDispatcher {
  private readonly logger = new Logger(NotificationsDispatcher.name);

  constructor(
    private readonly emailChannelDispatcher: EmailChannelDispatcher,
  ) {}

  async dispatch(input: NotificationEntity): Promise<void> {
    this.logger.log(`dispatching notification ${input.id}`);

    if (input.shouldSentByEmail()) {
      await this.emailChannelDispatcher.dispatch(input);
    }

  }
}
