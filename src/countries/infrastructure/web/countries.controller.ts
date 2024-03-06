import { Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommonController } from '../../../common/guards/decorators';
import { CountriesService } from '../../application/countries.service';
import { CountryListResponse } from './country-list.response';
import { FilterCountryDto } from './filter-country.dto';
import { IgnoreAuthorizationGuard } from '../../../authentication/infrastructure/web/decorators';

@IgnoreAuthorizationGuard()
@CommonController()
@ApiTags('Countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('countries')
  @ApiOkResponse({
    status: 200,
    type: CountryListResponse,
  })
  async findCountries(@Query() filters: FilterCountryDto): Promise<CountryListResponse> {
    const result = await this.countriesService.findCountries(
      {
        searchTerm: filters.searchTerm,
      },
      {
        page: filters.page,
        pageSize: filters.pageSize,
        orderBy: filters.orderBy,
        orderDir: filters.orderDir,
      },
    );
    return CountryListResponse.from(result, filters);
  }
}
