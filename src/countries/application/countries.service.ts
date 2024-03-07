import { Inject, Injectable } from '@nestjs/common';
import { Pagination, PaginationOption } from '../../common/database';
import { CityRegionEntity } from '../domain/entities/city-region.entity';
import { CityEntity } from '../domain/entities/city.entity';
import { CountryEntity } from '../domain/entities/country.entity';
import { StateEntity } from '../domain/entities/state.entity';
import {
  CITIES_REPOSITORY_TOKEN,
  CitiesRepository,
  CityOrderBy,
  FindCityOptions,
} from '../domain/repositories/cities.repository';
import {
  CITY_REGIONS_REPOSITORY_TOKEN,
  CityRegionOrderBy,
  CityRegionsRepository,
  FindCityRegionOptions,
} from '../domain/repositories/city-regions.repository';
import {
  COUNTRIES_REPOSITORY_TOKEN,
  CountriesRepository,
  FindRegionOptions,
  RegionOrderBy,
} from '../domain/repositories/countries.repository';
import {
  FindStateOptions,
  STATES_REPOSITORY_TOKEN,
  StateOrderBy,
  StatesRepository,
} from '../domain/repositories/states.repository';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(CITY_REGIONS_REPOSITORY_TOKEN) private readonly cityRegionRepository: CityRegionsRepository,
    @Inject(COUNTRIES_REPOSITORY_TOKEN) private readonly countriesRepository: CountriesRepository,
    @Inject(STATES_REPOSITORY_TOKEN) private readonly statesRepository: StatesRepository,
    @Inject(CITIES_REPOSITORY_TOKEN) private readonly cityRepository: CitiesRepository,
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
