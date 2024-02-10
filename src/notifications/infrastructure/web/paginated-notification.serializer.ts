import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NotificationSerializer } from './notification.serializer';

class PaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'total items',
  })
  @Expose()
  @Type(() => Number)
  total!: number;
}

export class PaginatedNotificationSerializer {
  @ApiProperty({
    type: NotificationSerializer,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => NotificationSerializer)
  items!: NotificationSerializer[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Stats',
  })
  @Expose()
  @Type(() => PaginationMeta)
  pagination!: PaginationMeta;
}
