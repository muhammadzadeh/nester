import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Pagination } from '../../../common/database';
import { ListResponse } from '../../../common/serialization';
import { StateEntity } from '../../domain/entities/state.entity';
import { FilterStateDto } from './filter-state.dto';
import { StateResponse } from './state.response';

export class StateListResponse extends ListResponse<StateResponse> {
  static from(data: Pagination<StateEntity>, filters: FilterStateDto): StateListResponse {
    return new StateListResponse(
      data.items.map((item) => StateResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: StateResponse,
    isArray: true,
    description: 'The country states',
  })
  @Type(() => StateResponse)
  declare items: StateResponse[];
}
