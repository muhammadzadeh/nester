import { PaginationDto } from '@repo/types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserOrderBy } from '../../../domain/repositories/users.repository';

export class FilterUserDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(UserOrderBy)
  orderBy!: UserOrderBy;
}
