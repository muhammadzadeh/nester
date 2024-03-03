import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { BaseSeeder, DatabaseSeeder } from '../../common/database';
import { CountryEntity } from '../domain/entities/country.entity';
import { camelCaseObject } from '../../common/utils';

@DatabaseSeeder()
export class CountriesSeeder extends BaseSeeder {
  private logger = new Logger(CountriesSeeder.name);

  static readonly description = 'This script will seed countries, state and city into db.';

  constructor(
    private readonly httpService: HttpService /* 
    private readonly datasource: DataSource,
    private readonly config: Configuration, */,
  ) {
    super();
  }

  async run(): Promise<void> {
    const data = await this.downloadDatasource();
    this.logger.log(data[0]);
  }

  private async downloadDatasource(): Promise<CountryEntity[]> {
    const url =
      'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json';
    const result = await lastValueFrom(this.httpService.get(url, { responseType: 'json' }));
    return camelCaseObject(result.data);
  }
}
