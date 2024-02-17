import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import {
  NotificationEntity,
  NotificationEvent,
  NotificationGroupType,
  NotificationPriority,
  NotificationStatus,
} from '../../domain/entities/notification.entity';
import { NotificationCTAResponse } from './notification-cta.response';
export class NotificationResponse {
  static from(data: NotificationEntity): NotificationResponse {
    return {
      id: data.id,
      title: data.notificationCenterData?.title!,
      description: data.notificationCenterData?.description!,
      ctas: data.notificationCenterData?.ctas!,
      event: data.event,
      groupType: data.groupType,
      priority: data.priority,
      status: data.status,
      createdAt: data.createdAt,
    };
  }
  @ApiProperty({
    type: String,
    description: 'The notification id',
    example: randomUUID(),
  })
  @Expose()
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
    description: 'The notification title',
    example: 'Verify your email',
  })
  @Expose()
  @Type(() => String)
  readonly title!: string;

  @ApiProperty({
    type: String,
    description: 'The notification description',
    example: 'Verify your email',
  })
  @Expose()
  @Type(() => String)
  readonly description!: string;

  @ApiProperty({
    type: NotificationEvent,
    enum: NotificationEvent,
    enumName: 'NotificationEvent',
    description: 'The notification template code',
  })
  @Expose()
  @Type(() => String)
  readonly event!: NotificationEvent;

  @ApiProperty({
    type: NotificationPriority,
    enum: NotificationPriority,
    enumName: 'NotificationPriority',
    description: 'notification priority',
  })
  @Expose()
  @Type(() => String)
  readonly priority!: NotificationPriority;

  @ApiProperty({
    type: NotificationGroupType,
    enum: NotificationGroupType,
    enumName: 'NotificationGroupType',
    description: 'notification group type',
    name: 'group_type',
  })
  @Expose()
  @Type(() => String)
  readonly groupType!: NotificationGroupType;

  @ApiProperty({
    type: NotificationStatus,
    enum: NotificationStatus,
    enumName: 'NotificationStatus',
    description: 'The notification status',
  })
  @Expose()
  @Type(() => String)
  readonly status!: NotificationStatus;

  @ApiProperty({
    type: NotificationCTAResponse,
    isArray: true,
    description: 'call to actions',
  })
  @Expose()
  @Type(() => NotificationCTAResponse)
  readonly ctas?: NotificationCTAResponse[];

  @ApiProperty({
    type: Date,
    description: 'The creation date',
    example: new Date(),
    name: 'created_at',
  })
  @Expose()
  @Type(() => Date)
  readonly createdAt!: Date;
}
