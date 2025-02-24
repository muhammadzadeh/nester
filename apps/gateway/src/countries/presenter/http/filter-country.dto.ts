import { PaginationDto } from '@package/types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegionOrderBy } from '../../domain/repositories/countries.repository';

export class FilterCountryDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(RegionOrderBy)
	orderBy!: RegionOrderBy;

	@IsOptional()
	@IsString()
	searchTerm?: string;
}
