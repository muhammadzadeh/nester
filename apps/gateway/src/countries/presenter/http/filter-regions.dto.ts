import { PaginationDto } from '@package/types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CityRegionOrderBy } from '../../domain/repositories/city-regions.repository';

export class FilterRegionDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(CityRegionOrderBy)
	orderBy!: CityRegionOrderBy;

	@IsOptional()
	@IsString()
	searchTerm?: string;
}
