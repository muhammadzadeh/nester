import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CityRegionOrderBy } from '../../domain/repositories/city-region.repository';

export class FilterRegionDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(CityRegionOrderBy)
  orderBy!: CityRegionOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsUUID('4')
  cityId?: string;
}
