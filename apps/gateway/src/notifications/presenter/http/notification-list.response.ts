import { ApiProperty } from '@nestjs/swagger';
import { ListResponse, Paginated } from '@package/types';
import { Type } from 'class-transformer';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { FilterNotificationDto } from './filter-notification.dto';
import { NotificationResponse } from './notification.response';

export class NotificationListResponse extends ListResponse<NotificationResponse> {
	static from(data: Paginated<NotificationEntity>, filters: FilterNotificationDto): NotificationListResponse {
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
	@Type(() => NotificationResponse)
	declare readonly items: NotificationResponse[];
}
