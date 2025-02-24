import { PaginationDto } from '@package/types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CityOrderBy } from '../../domain/repositories/cities.repository';

export class FilterCityDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(CityOrderBy)
	orderBy!: CityOrderBy;

	@IsOptional()
	@IsString()
	searchTerm?: string;
}
