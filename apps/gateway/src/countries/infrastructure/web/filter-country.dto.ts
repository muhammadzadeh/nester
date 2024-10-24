import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { RegionOrderBy } from '../../domain/repositories/countries.repository';

export class FilterCountryDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(RegionOrderBy)
  orderBy!: RegionOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
