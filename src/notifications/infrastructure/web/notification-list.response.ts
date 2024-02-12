import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { NotificationResponse } from './notification.response';

class PaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'total items',
  })
  @Type(() => Number)
  total!: number;
}

export class NotificationListResponse {
  @ApiProperty({
    type: NotificationResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Type(() => NotificationResponse)
  items!: NotificationResponse[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Stats',
  })
  @Type(() => PaginationMeta)
  pagination!: PaginationMeta;
}
