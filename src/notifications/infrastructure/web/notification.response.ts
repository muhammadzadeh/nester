import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { randomUUID } from 'crypto';
import { NotificationEvent, NotificationGroupType, NotificationPriority, NotificationStatus } from '../../domain/entities/notification.entity';
import { NotificationCTAResponse } from './notification-cta.response';
export class NotificationResponse {
  @ApiProperty({
    type: String,
    description: 'The notification id',
    example: randomUUID(),
  })
  @Expose()
  @Type(() => String)
  id!: string;

  @ApiProperty({
    type: String,
    description: 'The notification title',
    example: 'Verify your email',
  })
  @Expose()
  @Type(() => String)
  title!: string;

  @ApiProperty({
    type: String,
    description: 'The notification description',
    example: 'Verify your email',
  })
  @Expose()
  @Type(() => String)
  description!: string;

  @ApiProperty({
    type: NotificationEvent,
    enum: NotificationEvent,
    enumName: 'NotificationEvent',
    description: 'The notification template code',
  })
  @Expose()
  @Type(() => String)
  event!: NotificationEvent;

  @ApiProperty({
    type: NotificationPriority,
    enum: NotificationPriority,
    enumName: 'NotificationPriority',
    description: 'notification priority',
  })
  @Expose()
  @Type(() => String)
  priority!: NotificationPriority;

  @ApiProperty({
    type: NotificationGroupType,
    enum: NotificationGroupType,
    enumName: 'NotificationGroupType',
    description: 'notification group type',
    name: 'group_type',
  })
  @Expose()
  @Type(() => String)
  groupType!: NotificationGroupType;

  @ApiProperty({
    type: NotificationStatus,
    enum: NotificationStatus,
    enumName: 'NotificationStatus',
    description: 'The notification status',
  })
  @Expose()
  @Type(() => String)
  status!: NotificationStatus;

  @ApiProperty({
    type: NotificationCTAResponse,
    isArray: true,
    description: 'call to actions',
  })
  @Expose()
  @Type(() => NotificationCTAResponse)
  ctas?: NotificationCTAResponse[];

  @ApiProperty({
    type: Date,
    description: 'The creation date',
    example: new Date(),
    name: 'created_at',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
