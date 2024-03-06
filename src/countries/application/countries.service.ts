import { Inject, Injectable } from '@nestjs/common';
import { Pagination, PaginationOption } from '../../common/database';
import { CityRegionEntity } from '../domain/entities/city-region.entity';
import { CityEntity } from '../domain/entities/city.entity';
import { CountryEntity } from '../domain/entities/country.entity';
import { StateEntity } from '../domain/entities/state.entity';
import {
  CITY_REGIONS_REPOSITORY_TOKEN,
  CityRegionOrderBy,
  CityRegionRepository,
  FindCityRegionOptions,
} from '../domain/repositories/city-region.repository';
import {
  CITIES_REPOSITORY_TOKEN,
  CityOrderBy,
  CityRepository,
  FindCityOptions,
} from '../domain/repositories/city.repository';
import {
  COUNTRIES_REPOSITORY_TOKEN,
  CountriesRepository,
  FindRegionOptions,
  RegionOrderBy,
} from '../domain/repositories/country.repository';
import {
  FindStateOptions,
  STATES_REPOSITORY_TOKEN,
  StateOrderBy,
  StatesRepository,
} from '../domain/repositories/state.repository';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(CITY_REGIONS_REPOSITORY_TOKEN) private readonly cityRegionRepository: CityRegionRepository,
    @Inject(COUNTRIES_REPOSITORY_TOKEN) private readonly countriesRepository: CountriesRepository,
    @Inject(STATES_REPOSITORY_TOKEN) private readonly statesRepository: StatesRepository,
    @Inject(CITIES_REPOSITORY_TOKEN) private readonly cityRepository: CityRepository,
  ) {}

  async findCountries(
    options: Partial<FindRegionOptions>,
    pagination?: PaginationOption<RegionOrderBy>,
  ): Promise<Pagination<CountryEntity>> {
    return await this.countriesRepository.findAll(options, pagination);
  }

  async findStates(
    options: Partial<FindStateOptions>,
    pagination?: PaginationOption<StateOrderBy>,
  ): Promise<Pagination<StateEntity>> {
    return await this.statesRepository.findAll(options, pagination);
  }

  async findCities(
    options: Partial<FindCityOptions>,
    pagination?: PaginationOption<CityOrderBy>,
  ): Promise<Pagination<CityEntity>> {
    return await this.cityRepository.findAll(options, pagination);
  }

  async findRegions(
    options: Partial<FindCityRegionOptions>,
    pagination?: PaginationOption<CityRegionOrderBy>,
  ): Promise<Pagination<CityRegionEntity>> {
    return await this.cityRegionRepository.findAll(options, pagination);
  }
}
