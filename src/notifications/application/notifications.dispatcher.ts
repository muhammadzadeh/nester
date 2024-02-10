import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationChannelStatus, NotificationEntity } from '../domain/entities/notification.entity';
import { MAILER_TOKEN, Mailer } from './email-provider.interface';

@Injectable()
export class NotificationsDispatcher {
  private readonly logger = new Logger(NotificationsDispatcher.name);

  constructor(
    @Inject(MAILER_TOKEN) private readonly mailer: Mailer,
  ) {}

  async dispatch(input: NotificationEntity): Promise<void> {
    this.logger.log(`dispatching notification ${input.id}`);

    if (input.shouldSentByEmail()) {
      await this.sendEmail(input);
    }

  }

  private async sendEmail(input: NotificationEntity): Promise<NotificationDispatcherResponse> {
    try {
      return this.mailer.sendMail(input.emailData!);
    } catch (error: any) {
      return {
        status: NotificationChannelStatus.FAILED,
        providerResult: error.message,
      };
    }
  }
}

export interface NotificationDispatcherResponse {
  status: NotificationChannelStatus;
  providerResult?: any;
}