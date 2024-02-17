import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Pagination } from '../../../../common/database';
import { ListResponse } from '../../../../common/serialization';
import { RoleEntity } from '../../domain/entities/role.entity';
import { FilterRoleDto } from './filter-role.dto';
import { RoleResponse } from './role.response';

export class RoleListResponse extends ListResponse<RoleResponse> {
  static from(data: Pagination<RoleEntity>, filters: FilterRoleDto): RoleListResponse {
    return new RoleListResponse(
      data.items.map((item) => RoleResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: RoleResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => RoleResponse)
  declare items: RoleResponse[];
}
