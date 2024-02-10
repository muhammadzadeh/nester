import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, Configuration } from '../../common/config';
import { EmailChannelDispatcher, } from '../application/dispatchers';
import { MAILER_TOKEN, Mailer } from '../application/email-provider.interface';
import { NotificationsConsumer } from '../application/notifications.consumer';
import { NotificationsDispatcher } from '../application/notifications.dispatcher';
import { NotificationsService } from '../application/notifications.service';
import { NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN } from '../domain/repositories/notification-push-tokens.repository';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../domain/repositories/notifications.repository';
import { TypeormNotificationPushTokenEntity } from './database/entities/typeorm-notification-push-token.entity';
import { TypeormNotificationPushTokensRepository } from './database/repositories/typeorm-notification-push-token.repository';
import { TypeormNotificationsRepository } from './database/repositories/typeorm-notification.repository';
import { LocalMailer, MailgunMailer, SendgridMailer } from './providers/email';
import { NotificationController } from './web/notification.controller';
import { TypeormNotificationEntity } from './database/entities/typeorm-notification.entity';

const mailProvider: Provider = {
  provide: MAILER_TOKEN,
  inject: [Configuration, HttpService],
  useFactory: (config: Configuration, httpService: HttpService): Mailer => {
    switch (config.mailer?.provider) {
      case 'local':
        return new LocalMailer();
      case 'mailgun':
        return new MailgunMailer(config, httpService);
      case 'sendgrid':
        return new SendgridMailer(config);
      default:
        return new LocalMailer();
    }
  },
};

const notificationsRepository: Provider = {
  provide: NOTIFICATION_REPOSITORY_TOKEN,
  useClass: TypeormNotificationsRepository,
};

const notificationPushTokensRepository: Provider = {
  provide: NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN,
  useClass: TypeormNotificationPushTokensRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormNotificationEntity, TypeormNotificationPushTokenEntity]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [NotificationController],
  providers: [
    mailProvider,
    EmailChannelDispatcher,
    NotificationsConsumer,
    NotificationsDispatcher,
    NotificationsService,
    notificationsRepository,
    notificationPushTokensRepository,
  ],
  exports: [],
})
export class NotificationsModule {}
