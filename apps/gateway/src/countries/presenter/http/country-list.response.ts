import { ApiProperty } from '@nestjs/swagger';
import { ListResponse, Paginated } from '@repo/types';
import { Type } from 'class-transformer';
import { CountryEntity } from '../../domain/entities/country.entity';
import { CountryResponse } from './country.response';
import { FilterCountryDto } from './filter-country.dto';

export class CountryListResponse extends ListResponse<CountryResponse> {
	static from(data: Paginated<CountryEntity>, filters: FilterCountryDto): CountryListResponse {
		return new CountryListResponse(
			data.items.map((item) => CountryResponse.from(item)),
			{
				total: data.total,
				page: filters.page,
				pageSize: filters.pageSize,
			},
		);
	}

	@ApiProperty({
		type: CountryResponse,
		isArray: true,
		description: 'The countries',
	})
	@Type(() => CountryResponse)
	declare items: CountryResponse[];
}
