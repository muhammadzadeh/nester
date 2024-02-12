import { Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../authenticate/infrastructure/web/decorators';
import { UserController } from '../../../../common/guards/decorators';
import { Serializer } from '../../../../common/serialization';
import { ResponseGroup } from '../../../../common/types';
import { UsersService } from '../../../application/users.service';
import { UserResponse } from '../common/user.response';

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
}
