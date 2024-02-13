import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleResponse } from './role.response';

class PaginationMeta {
  @ApiProperty({
    type: Number,
    description: 'total items',
  })
  @Expose()
  @Type(() => Number)
  total!: number;
}

export class RoleListResponse {
  @ApiProperty({
    type: RoleResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => RoleResponse)
  items!: RoleResponse[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Stats',
  })
  @Expose()
  @Type(() => PaginationMeta)
  pagination!: PaginationMeta;
}
