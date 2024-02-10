import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../authenticate/infrastructure/web/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { DoneSerializer, Serializer } from '../../../common/serialization';
import { OrderDir } from '../../../common/types';
import { NotificationsService } from '../../application/notifications.service';
import { NotificationOrderBy } from '../../domain/repositories/notifications.repository';
import { AddPushTokenDto } from './add-push-token.dto';
import { FilterNotificationDto } from './filter-notification.dto';
import { FindOneNotificationDto } from './find-one-notification.dto';
import { NotificationUnreadCountSerializer } from './notification-unread-count.serializer';
import { PaginatedNotificationSerializer } from './paginated-notification.serializer';

@CommonController('/notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('read')
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async markNotificationAsRead(
    @Body() { id }: FindOneNotificationDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<DoneSerializer> {
    await this.notificationsService.markNotificationAsRead(id, user.id);
    return Serializer.done();
  }

  @Post('read-all')
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async markAllNotificationsAsRead(@CurrentUser() user: CurrentUser): Promise<DoneSerializer> {
    await this.notificationsService.markAllNotificationsAsRead(user.id);
    return Serializer.done();
  }

  @Get('unread-count')
  @ApiOkResponse({
    status: 200,
    type: NotificationUnreadCountSerializer,
  })
  async findNotificationUnreadCount(@CurrentUser() user: CurrentUser): Promise<NotificationUnreadCountSerializer> {
    const count = await this.notificationsService.getNotificationUnreadCount(user.id);
    return Serializer.serialize(NotificationUnreadCountSerializer, { count });
  }

  @Get()
  @ApiOkResponse({
    status: 200,
    type: PaginatedNotificationSerializer,
  })
  async findAll(
    @Query() filtersDto: FilterNotificationDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<PaginatedNotificationSerializer> {
    const result = await this.notificationsService.findAll({
      page: filtersDto.page,
      pageSize: filtersDto.pageSize,
      orderBy: NotificationOrderBy.CREATED_AT,
      orderDir: OrderDir.DESC,
      userIds: [user.id],
      showInNotificationCenter: true,
    });

    return Serializer.serialize(PaginatedNotificationSerializer, result);
  }

  @Post('tokens')
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async addPushToken(@Body() { token }: AddPushTokenDto, @CurrentUser() user: CurrentUser): Promise<DoneSerializer> {
    await this.notificationsService.addPushToken(token, user.id);
    return Serializer.done();
  }
}
