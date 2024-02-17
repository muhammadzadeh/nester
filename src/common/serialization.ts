import { ApiProperty } from '@nestjs/swagger';
import { ClassConstructor, Expose, Type, plainToInstance } from 'class-transformer';
import { snackCaseObject } from './utils';
import { ResponseGroup } from './types';
import { MIN_PAGE_NUMBER, MIN_PAGE_SIZE } from './constants';


export interface PagedResponseMeta {
  readonly total: number;
  readonly pageSize: number;
  readonly page: number;
}

export class PaginationMetaResponse {
  @ApiProperty({
    type: Number,
    description: 'Total items',
  })
  @Expose()
  @Type(() => Number)
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Items count per page',
    example: 20,
    name: 'page_size',
  })
  @Expose()
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({
    type: Number,
    description: 'Current Page',
    example: 1,
    name: 'current_page',
  })
  @Expose()
  @Type(() => Number)
  currentPage: number;

  @ApiProperty({
    type: Number,
    description: 'Last page number',
    example: 100,
    name: 'last_page',
  })
  @Expose()
  @Type(() => Number)
  lastPage: number;

  @ApiProperty({
    type: Number,
    description: 'returned items from index',
    example: 10,
  })
  @Expose()
  @Type(() => Number)
  from: number;

  @ApiProperty({
    type: Number,
    description: 'returned items to index',
    example: 20,
  })
  @Expose()
  @Type(() => Number)
  to: number;

  constructor(total: number, page: number, pageSize: number) {
    this.total = total;
    this.pageSize = pageSize;
    this.currentPage = page;
    this.lastPage = Math.ceil(total / pageSize);
    this.from = (page - 1) * pageSize + 1;
    this.to = this.lastPage == page ? total : this.from + pageSize - 1;
  }
}

export class ListMetaResponse {
  @ApiProperty({
    type: PaginationMetaResponse,
    description: 'pagination meta',
  })
  @Expose()
  @Type(() => PaginationMetaResponse)
  pagination!: PaginationMetaResponse;
}

export class ListResponse<T> {
  readonly items!: T[];

  @ApiProperty({
    type: ListMetaResponse,
    description: 'pagination meta',
  })
  @Expose()
  @Type(() => ListMetaResponse)
  readonly meta!: ListMetaResponse;

  constructor();
  constructor(items: T[], stats: { total: number; page?: number; pageSize?: number });
  constructor(items?: T[], stats?: { total: number; page?: number; pageSize?: number }) {
    this.items = items ?? [];
    this.meta = {
      pagination: new PaginationMetaResponse(
        stats?.total ?? 0,
        stats?.page ?? MIN_PAGE_NUMBER,
        stats?.pageSize ?? MIN_PAGE_SIZE,
      ),
    };
  }
}

export class DoneResponse {
  @ApiProperty({
    type: String,
    example: 'OK',
  })
  @Expose()
  @Type(() => String)
  message!: string;
}

export class Serializer {
  static serialize<T, K>(output: ClassConstructor<T>, input: K, groups?: ResponseGroup[]): T {
    return snackCaseObject<T>(
      plainToInstance(output, input, {
        exposeDefaultValues: true,
        exposeUnsetFields: true,
        strategy: 'excludeAll',
        groups,
      }),
    );
  }

  static done() {
    return Serializer.serialize(DoneResponse, { message: 'OK' });
  }
}
