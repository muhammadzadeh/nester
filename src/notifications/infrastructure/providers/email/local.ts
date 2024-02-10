import { Injectable, Logger } from '@nestjs/common';
import { ChannelDispatcherResponse } from '../../../application/dispatchers';
import { EmailMappedData, Mailer } from '../../../application/email-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';

@Injectable()
export class LocalMailer implements Mailer {
  private readonly logger = new Logger(LocalMailer.name);

  getName(): string {
    return 'local';
  }

  async sendMail(data: EmailMappedData): Promise<ChannelDispatcherResponse> {
    this.logger.log(`localMailer::sendMail :: ${JSON.stringify(data)}`);
    return {
      status: NotificationChannelStatus.SENT,
    };
  }
}
