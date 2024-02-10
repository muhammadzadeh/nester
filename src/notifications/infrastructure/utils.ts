import { publish } from '../../common/rabbit/application/rabbit-mq.service';
import { NotificationCreatedEvent, NotificationEvents } from '../domain/events';
import { NOTIFICATION_EXCHANGE_NAME } from './constants';

export function sendNotification(input: NotificationCreatedEvent): void {
  publish(NOTIFICATION_EXCHANGE_NAME, NotificationEvents.NOTIFICATION_CREATED, input, {
    persistent: true,
    deliveryMode: 2,
  }).catch((error: any) => {
    console.error(error);
  });
}
