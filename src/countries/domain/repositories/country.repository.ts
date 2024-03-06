import { Pagination, PaginationOption } from '../../../common/database';
import { CountryEntity } from '../entities/country.entity';

export const COUNTRIES_REPOSITORY_TOKEN = Symbol('CountriesRepository');

export interface FindCountryOptions {
  searchTerm: string;
}

export enum CountryOrderBy {
  NAME = 'name',
}

export interface CountriesRepository {
  findAll(
    options: Partial<FindCountryOptions>,
    pagination?: PaginationOption<CountryOrderBy>,
  ): Promise<Pagination<CountryEntity>>;
  exists(options: Partial<FindCountryOptions>): Promise<boolean>;
}
