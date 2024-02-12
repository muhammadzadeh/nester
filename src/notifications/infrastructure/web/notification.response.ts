import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import {
  NotificationEvent,
  NotificationGroupType,
  NotificationPriority,
  NotificationStatus,
} from '../../domain/entities/notification.entity';
import { NotificationCTAResponse } from './notification-cta.response';
export class NotificationResponse {
  @ApiProperty({
    type: String,
    description: 'The notification id',
    example: randomUUID(),
  })
  @Type(() => String)
  id!: string;

  @ApiProperty({
    type: String,
    description: 'The notification title',
    example: 'Verify your email',
  })
  @Type(() => String)
  title!: string;

  @ApiProperty({
    type: String,
    description: 'The notification description',
    example: 'Verify your email',
  })
  @Type(() => String)
  description!: string;

  @ApiProperty({
    type: NotificationEvent,
    enum: NotificationEvent,
    description: 'The notification template code',
  })
  @Type(() => String)
  event!: NotificationEvent;

  @ApiProperty({
    type: NotificationPriority,
    enum: NotificationPriority,
    description: 'notification priority',
  })
  @Type(() => String)
  priority!: NotificationPriority;

  @ApiProperty({
    type: NotificationGroupType,
    enum: NotificationGroupType,
    description: 'notification group type',
    name: 'group_type',
  })
  @Type(() => String)
  groupType!: NotificationGroupType;

  @ApiProperty({
    type: NotificationStatus,
    enum: NotificationStatus,
    description: 'The notification status',
  })
  @Type(() => String)
  status!: NotificationStatus;

  @ApiProperty({
    type: NotificationCTAResponse,
    isArray: true,
    description: 'call to actions',
  })
  @Type(() => NotificationCTAResponse)
  ctas?: NotificationCTAResponse[];

  @ApiProperty({
    type: Date,
    description: 'The creation date',
    example: new Date(),
    name: 'created_at',
  })
  @Type(() => Date)
  createdAt!: Date;
}
