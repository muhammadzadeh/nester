import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { MAX_PAGE_SIZE } from '../constants';
import { OrderDir } from '../types';

export class PaginationDto {
  @Min(1)
  @Max(10_000)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page!: number;

  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize!: number;

  @IsEnum(OrderDir)
  @IsNotEmpty()
  orderDir!: OrderDir;
}
