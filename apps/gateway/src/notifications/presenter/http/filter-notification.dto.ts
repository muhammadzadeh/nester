import { PaginationDto } from '@package/types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationOrderBy } from '../../domain/repositories/notifications.repository';

export class FilterNotificationDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(NotificationOrderBy)
	orderBy!: NotificationOrderBy;
}
