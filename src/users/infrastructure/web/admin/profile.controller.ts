import { Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequiredPermissions } from '../../../../authenticate/infrastructure/web/decorators';
import { AdminController } from '../../../../common/guards/decorators';
import { Serializer } from '../../../../common/serialization';
import { ResponseGroup } from '../../../../common/types';
import { UsersService } from '../../../application/users.service';
import { Permission } from '../../../domain/entities/user.entity';
import { GetUserDto } from '../common/get-user.dto';
import { UserResponse } from '../common/user.response';

@ApiTags('Users')
@RequiredPermissions(Permission.MANAGE_USERS)
@AdminController(`/users`)
export class ProfileControllerForAdmin {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({
    status: 200,
    type: UserResponse,
  })
  async getUserById(@Param() params: GetUserDto): Promise<UserResponse> {
    const userProfile = await this.usersService.findOneByIdentifierOrFail(params.id);
    return Serializer.serialize(UserResponse, userProfile, [ResponseGroup.ADMIN]);
  }
}
