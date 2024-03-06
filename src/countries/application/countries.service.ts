import { Inject, Injectable } from '@nestjs/common';
import { Pagination, PaginationOption } from '../../common/database';
import { CountryEntity } from '../domain/entities/country.entity';
import {
  COUNTRIES_REPOSITORY_TOKEN,
  CountriesRepository,
  CountryOrderBy,
  FindCountryOptions,
} from '../domain/repositories/country.repository';

@Injectable()
export class CountriesService {
  constructor(@Inject(COUNTRIES_REPOSITORY_TOKEN) private readonly countriesRepository: CountriesRepository) {}

  async findCountries(
    options: Partial<FindCountryOptions>,
    pagination?: PaginationOption<CountryOrderBy>,
  ): Promise<Pagination<CountryEntity>> {
    return await this.countriesRepository.findAll(options, pagination);
  }
}
