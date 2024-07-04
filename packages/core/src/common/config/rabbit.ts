import { Type } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../authentication/domain/constants';
import { NOTIFICATION_EXCHANGE_NAME } from '../../notifications/infrastructure/constants';
import { RabbitMQExchangeOptions } from '../rabbit/application/rabbit-mq.service';

export class RabbitConfig {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly uri!: string;

  readonly exchanges: RabbitMQExchangeOptions[] = [
    {
      name: AUTHENTICATION_EXCHANGE_NAME,
      type: 'direct',
    },

    {
      name: NOTIFICATION_EXCHANGE_NAME,
      type: 'direct',
    },
  ];
}
