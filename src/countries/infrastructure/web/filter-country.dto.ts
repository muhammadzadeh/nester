import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { CountryOrderBy } from '../../domain/repositories/country.repository';

export class FilterCountryDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(CountryOrderBy)
  orderBy!: CountryOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
