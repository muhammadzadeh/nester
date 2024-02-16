import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Pagination } from '../../../common/database';
import { ListResponse } from '../../../common/serialization';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { FilterNotificationDto } from './filter-notification.dto';
import { NotificationResponse } from './notification.response';

export class NotificationListResponse extends ListResponse<NotificationResponse> {
  static from(data: Pagination<NotificationEntity>, filters: FilterNotificationDto): NotificationListResponse {
    return new NotificationListResponse(
      data.items.map((item) => NotificationResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: NotificationResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => NotificationResponse)
  declare readonly items: NotificationResponse[];
}
