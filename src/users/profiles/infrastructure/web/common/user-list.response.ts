import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListResponse } from '../../../../../common/serialization';
import { UserResponse } from './user.response';

export class UserListResponse extends ListResponse<UserResponse> {
  @ApiProperty({
    type: UserResponse,
    isArray: true,
    description: 'The Users',
  })
  @Expose()
  @Type(() => UserResponse)
  declare items: UserResponse[];
}
