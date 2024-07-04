import { Pagination, PaginationOption } from '../../../common/database';
import { CityEntity } from '../entities/city.entity';

export const CITIES_REPOSITORY_TOKEN = Symbol('CitiesRepository');

export interface FindCityOptions {
  stateId: string;
  searchTerm: string;
}

export enum CityOrderBy {
  NAME = 'name',
}

export interface CitiesRepository {
  findAll(
    options: Partial<FindCityOptions>,
    pagination?: PaginationOption<CityOrderBy>,
  ): Promise<Pagination<CityEntity>>;
  exists(options: Partial<FindCityOptions>): Promise<boolean>;
}
