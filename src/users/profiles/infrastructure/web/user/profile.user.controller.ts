import { Body, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../../authenticate/infrastructure/web/decorators';
import { UserController } from '../../../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../../../common/serialization';
import { ResponseGroup } from '../../../../../common/types';
import { UsersService } from '../../../application/users.service';
import { UserResponse } from '../common/user.response';
import { UpdateMyProfileDto } from './update-my-profile.dto';

@ApiTags('Profile')
@UserController(`/profile`)
export class ProfileControllerForUser {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  async getMyProfile(@CurrentUser() user: CurrentUser): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(user.id);
    return Serializer.serialize(UserResponse, userProfile, [ResponseGroup.RESOURCE_OWNER]);
  }

  @Put()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async updateMyProfile(@CurrentUser() user: CurrentUser, @Body() data: UpdateMyProfileDto): Promise<DoneResponse> {
    await this.usersService.updateProfile(user.id, data.toEntity());
    return Serializer.done();
  }
}
