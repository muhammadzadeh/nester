import { Inject, Injectable } from '@nestjs/common';
import { NotificationChannelStatus, NotificationEntity } from '../../domain/entities/notification.entity';
import { MAILER_TOKEN, Mailer } from '../email-provider.interface';
import { BaseChannelDispatcher, ChannelDispatcherResponse } from './base';

@Injectable()
export class EmailChannelDispatcher extends BaseChannelDispatcher {
  constructor(@Inject(MAILER_TOKEN) private readonly mailer: Mailer) {
    super();
  }

  async dispatch(input: NotificationEntity): Promise<ChannelDispatcherResponse> {
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
