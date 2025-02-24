import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, User } from '@package/authentication';
import { CommonController } from '@package/decorator';
import { DoneResponse } from '@package/types';
import { NotificationsService } from '../../application/notifications.service';
import { AddPushTokenDto } from './add-push-token.dto';
import { FilterNotificationDto } from './filter-notification.dto';
import { FindOneNotificationDto } from './find-one-notification.dto';
import { NotificationListResponse } from './notification-list.response';
import { NotificationUnreadCountResponse } from './notification-unread-count.response';

@CommonController('/notifications')
@ApiTags('Notifications')
export class NotificationController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post('read')
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	async markNotificationAsRead(
		@Body() { id }: FindOneNotificationDto,
		@User() user: CurrentUser,
	): Promise<DoneResponse> {
		await this.notificationsService.markNotificationAsRead(id, user.id);
		return new DoneResponse();
	}

	@Post('read-all')
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	async markAllNotificationsAsRead(@User() user: CurrentUser): Promise<DoneResponse> {
		await this.notificationsService.markAllNotificationsAsRead(user.id);
		return new DoneResponse();
	}

	@Get('unread-count')
	@ApiOkResponse({
		status: 200,
		type: NotificationUnreadCountResponse,
	})
	async findNotificationUnreadCount(@User() user: CurrentUser): Promise<NotificationUnreadCountResponse> {
		const count = await this.notificationsService.getNotificationUnreadCount(user.id);
		return NotificationUnreadCountResponse.from(count);
	}

	@Get()
	@ApiOkResponse({
		status: 200,
		type: NotificationListResponse,
	})
	async findAll(
		@Query() filtersDto: FilterNotificationDto,
		@User() user: CurrentUser,
	): Promise<NotificationListResponse> {
		const result = await this.notificationsService.findAll({
			page: filtersDto.page,
			pageSize: filtersDto.pageSize,
			orderBy: filtersDto.orderBy,
			orderDir: filtersDto.orderDir,
			userIds: [user.id],
			showInNotificationCenter: true,
		});

		return NotificationListResponse.from(result, filtersDto);
	}

	@Post('tokens')
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	async addPushToken(@Body() { token }: AddPushTokenDto, @User() user: CurrentUser): Promise<DoneResponse> {
		await this.notificationsService.addPushToken(token, user.id);
		return new DoneResponse();
	}
}
