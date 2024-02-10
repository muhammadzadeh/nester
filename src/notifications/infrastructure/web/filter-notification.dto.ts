import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { NotificationOrderBy } from '../../domain/repositories/notifications.repository';

export class FilterNotificationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(NotificationOrderBy)
  order_by?: NotificationOrderBy;
}
