import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Pagination } from '../../../common/database';
import { ListResponse } from '../../../common/serialization';
import { CityEntity } from '../../domain/entities/city.entity';
import { CityResponse } from './city.response';
import { FilterCityDto } from './filter-city.dto';

export class CityListResponse extends ListResponse<CityResponse> {
  static from(data: Pagination<CityEntity>, filters: FilterCityDto): CityListResponse {
    return new CityListResponse(
      data.items.map((item) => CityResponse.from(item)),
      {
        total: data.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    );
  }

  @ApiProperty({
    type: CityResponse,
    isArray: true,
    description: 'The state cities',
  })
  @Type(() => CityResponse)
  declare items: CityResponse[];
}
