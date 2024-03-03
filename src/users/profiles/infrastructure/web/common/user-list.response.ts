import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Pagination } from '../../../../../common/database';
import { ListResponse } from '../../../../../common/serialization';
import { UserEntity } from '../../../domain/entities/user.entity';
import { FilterUserDto } from './filter-user.dto';
import { UserResponse } from './user.response';

export class UserListResponse extends ListResponse<UserResponse> {
  static from(data: Pagination<UserEntity>, filters: FilterUserDto): UserListResponse {
    return new UserListResponse(
      data.items.map((item) => UserResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: UserResponse,
    isArray: true,
    description: 'The Users',
  })
  @Type(() => UserResponse)
  declare items: UserResponse[];
}
