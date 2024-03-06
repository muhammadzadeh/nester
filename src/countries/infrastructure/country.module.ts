import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesSeeder } from '../application/countries.seeder';
import { COUNTRIES_REPOSITORY_TOKEN } from '../domain/repositories/country.repository';
import { TypeormCityRegionEntity } from './database/entities/typeorm-city-region.entity';
import { TypeormCityEntity } from './database/entities/typeorm-city.entity';
import { TypeormCountryEntity } from './database/entities/typeorm-country.entity';
import { TypeormStateEntity } from './database/entities/typeorm-state.entity';
import { TypeormCountriesRepository } from './database/repositories/typeorm-countries.repository';

const countryProvider: Provider = {
  provide: COUNTRIES_REPOSITORY_TOKEN,
  useClass: TypeormCountriesRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormCountryEntity, TypeormStateEntity, TypeormCityEntity, TypeormCityRegionEntity]),
    HttpModule,
  ],
  providers: [CountriesSeeder, countryProvider],
})
export class CountryModule {}
