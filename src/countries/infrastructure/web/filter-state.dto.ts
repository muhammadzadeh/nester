import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { StateOrderBy } from '../../domain/repositories/state.repository';

export class FilterStateDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(StateOrderBy)
  orderBy!: StateOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsUUID('4')
  countryId?: string;
}
