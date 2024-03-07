import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CityRegionOrderBy } from '../../domain/repositories/city-regions.repository';

export class FilterRegionDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(CityRegionOrderBy)
  orderBy!: CityRegionOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
