import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListResponse } from '../../../../common/serialization';
import { RoleResponse } from './role.response';

export class RoleListResponse extends ListResponse<RoleResponse> {
  @ApiProperty({
    type: RoleResponse,
    isArray: true,
    description: 'The Notifications',
  })
  @Expose()
  @Type(() => RoleResponse)
  declare items: RoleResponse[];
}
