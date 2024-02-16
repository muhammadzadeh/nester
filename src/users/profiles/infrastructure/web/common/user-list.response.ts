import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseGroup } from '../../../../../common/types';
import { UserResponse } from './user.response';

class PaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'total items',
  })
  @Expose()
  @Type(() => Number)
  total!: number;
}

export class UserListResponse {
  @ApiProperty({
    type: UserResponse,
    isArray: true,
    description: 'The Users',
  })
  @Expose({
    groups: [ResponseGroup.ADMIN_LIST],
  })
  @Type(() => UserResponse)
  items!: UserResponse[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Stats',
  })
  @Expose({
    groups: [ResponseGroup.ADMIN_LIST],
  })
  @Type(() => PaginationMeta)
  pagination!: PaginationMeta;
}
