import { NotificationChannelStatus, NotificationEntity } from '../../domain/entities/notification.entity';

export abstract class BaseChannelDispatcher {
  abstract dispatch(data: NotificationEntity): Promise<ChannelDispatcherResponse>;
}

export interface ChannelDispatcherResponse {
  status: NotificationChannelStatus;
  providerResult?: any;
}
