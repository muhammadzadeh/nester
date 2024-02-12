import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../authenticate/infrastructure/web/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../common/serialization';
import { OrderDir } from '../../../common/types';
import { NotificationsService } from '../../application/notifications.service';
import { NotificationOrderBy } from '../../domain/repositories/notifications.repository';
import { AddPushTokenDto } from './add-push-token.dto';
import { FilterNotificationDto } from './filter-notification.dto';
import { FindOneNotificationDto } from './find-one-notification.dto';
import { NotificationUnreadCountResponse } from './notification-unread-count.response';
import { NotificationListResponse } from './notification-list.response';

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
    @CurrentUser() user: CurrentUser,
  ): Promise<DoneResponse> {
    await this.notificationsService.markNotificationAsRead(id, user.id);
    return Serializer.done();
  }

  @Post('read-all')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async markAllNotificationsAsRead(@CurrentUser() user: CurrentUser): Promise<DoneResponse> {
    await this.notificationsService.markAllNotificationsAsRead(user.id);
    return Serializer.done();
  }

  @Get('unread-count')
  @ApiOkResponse({
    status: 200,
    type: NotificationUnreadCountResponse,
  })
  async findNotificationUnreadCount(@CurrentUser() user: CurrentUser): Promise<NotificationUnreadCountResponse> {
    const count = await this.notificationsService.getNotificationUnreadCount(user.id);
    return Serializer.serialize(NotificationUnreadCountResponse, { count });
  }

  @Get()
  @ApiOkResponse({
    status: 200,
    type: NotificationListResponse,
  })
  async findAll(
    @Query() filtersDto: FilterNotificationDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<NotificationListResponse> {
    const result = await this.notificationsService.findAll({
      page: filtersDto.page,
      pageSize: filtersDto.pageSize,
      orderBy: NotificationOrderBy.CREATED_AT,
      orderDir: OrderDir.DESC,
      userIds: [user.id],
      showInNotificationCenter: true,
    });

    return Serializer.serialize(NotificationListResponse, result);
  }

  @Post('tokens')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async addPushToken(@Body() { token }: AddPushTokenDto, @CurrentUser() user: CurrentUser): Promise<DoneResponse> {
    await this.notificationsService.addPushToken(token, user.id);
    return Serializer.done();
  }
}
