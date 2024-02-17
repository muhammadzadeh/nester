import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListResponse } from '../../../../../common/serialization';
import { UserResponse } from './user.response';
import { Pagination } from '../../../../../common/database';
import { UserEntity } from '../../../domain/entities/user.entity';
import { FilterUserDto } from './filter-user.dto';

export class UserListResponse extends ListResponse<UserResponse> {
  static from(data: Pagination<UserEntity>, filters: FilterUserDto): UserListResponse{
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
  @Expose()
  @Type(() => UserResponse)
  declare items: UserResponse[];
}
