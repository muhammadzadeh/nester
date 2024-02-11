import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NotificationResponse } from './notification.response';

class PaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'total items',
  })
  @Expose()
  @Type(() => Number)
  total!: number;
}

export class NotificationListResponse {
  @ApiProperty({
    type: NotificationResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => NotificationResponse)
  items!: NotificationResponse[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Stats',
  })
  @Expose()
  @Type(() => PaginationMeta)
  pagination!: PaginationMeta;
}
