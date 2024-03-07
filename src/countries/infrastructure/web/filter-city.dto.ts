import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CityOrderBy } from '../../domain/repositories/cities.repository';

export class FilterCityDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(CityOrderBy)
  orderBy!: CityOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
