import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CityOrderBy } from '../../domain/repositories/city.repository';

export class FilterCityDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(CityOrderBy)
  orderBy!: CityOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsUUID('4')
  stateId?: string;
}
