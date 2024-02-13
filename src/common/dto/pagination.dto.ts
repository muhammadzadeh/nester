import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '../constants';
import { OrderDir } from '../types';

export class PaginationDto {
  @Min(1)
  @Max(10_000)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page!: number;

  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @IsNumber()
  @IsNotEmpty()
  @ApiPropertyOptional({ default: MIN_PAGE_SIZE, name: 'page_size' })
  @Type(() => Number)
  page_size!: number;

  @IsEnum(OrderDir)
  @IsNotEmpty()
  @ApiPropertyOptional({ enum: OrderDir, default: OrderDir.ASC, name: 'order_dir' })
  order_dir!: OrderDir;
}
