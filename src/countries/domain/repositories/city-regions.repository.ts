import { Pagination, PaginationOption } from '../../../common/database';
import { CityRegionEntity } from '../entities/city-region.entity';

export const CITY_REGIONS_REPOSITORY_TOKEN = Symbol('CityRegionsRepository');

export interface FindCityRegionOptions {
  cityId: string;
  searchTerm: string;
}

export enum CityRegionOrderBy {
  NAME = 'name',
}

export interface CityRegionsRepository {
  save(data: CityRegionEntity): Promise<CityRegionEntity>;
  findAll(
    options: Partial<FindCityRegionOptions>,
    pagination?: PaginationOption<CityRegionOrderBy>,
  ): Promise<Pagination<CityRegionEntity>>;
  exists(options: Partial<FindCityRegionOptions>): Promise<boolean>;
}
