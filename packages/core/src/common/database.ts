import { OrderDir } from '@nester/common';
import { Injectable, SetMetadata, applyDecorators } from '@nestjs/common';
import { EntityManager } from 'typeorm';

export abstract class BaseRepository<T> {
  abstract attachToTransaction(entityManager?: EntityManager): T;
}

export abstract class BaseSeeder {
  abstract run(): Promise<void>;
}

export const DATABASE_SEEDER_TAG = 'database_seeder_tag';
export const DatabaseSeeder = () => applyDecorators(Injectable(), SetMetadata(DATABASE_SEEDER_TAG, true));

export interface Pagination<T> {
  items: T[];
  total: number;
}

export interface PaginationOption<T> {
  page: number;
  pageSize: number;
  orderBy: T;
  orderDir: OrderDir;
}
