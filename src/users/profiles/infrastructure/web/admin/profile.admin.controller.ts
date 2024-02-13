import { Body, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequiredPermissions } from '../../../../authenticate/infrastructure/web/decorators';
import { AdminController } from '../../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../../common/serialization';
import { ResponseGroup } from '../../../../common/types';
import { UsersService } from '../../../application/users.service';
import { GetUserDto } from '../common/get-user.dto';
import { UserResponse } from '../common/user.response';
import { UpdateUserPermissionDto } from './update-user-permission.dto';
import { Permission } from '../../../domain/entities/role.entity';

@ApiTags('Users')
@AdminController(`/users`)
export class ProfileControllerForAdmin {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  @RequiredPermissions(Permission.READ_USERS)
  async getUserById(@Param() params: GetUserDto): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(params.id);
    return Serializer.serialize(UserResponse, userProfile, [ResponseGroup.ADMIN]);
  }

  @Patch(':id/permissions')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  @RequiredPermissions(Permission.WRITE_USERS)
  async updateMyProfile(@Param() params: GetUserDto, @Body() data: UpdateUserPermissionDto): Promise<DoneResponse> {
    await this.usersService.updateProfile(params.id, data.toEntity());
    return Serializer.done();
  }
}
