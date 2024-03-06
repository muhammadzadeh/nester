import { Pagination, PaginationOption } from '../../../common/database';
import { CityEntity } from '../entities/city.entity';

export const CITIES_REPOSITORY_TOKEN = Symbol('CityRepository');

export interface FindCityOptions {
  stateId: string;
  searchTerm: string;
}

export enum CityOrderBy {
  NAME = 'name',
}

export interface CityRepository {
  findAll(
    options: Partial<FindCityOptions>,
    pagination?: PaginationOption<CityOrderBy>,
  ): Promise<Pagination<CityEntity>>;
  exists(options: Partial<FindCityOptions>): Promise<boolean>;
}
