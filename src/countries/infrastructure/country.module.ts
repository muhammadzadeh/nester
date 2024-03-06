import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesSeeder } from '../application/countries.seeder';
import { TypeormCityRegionEntity } from './database/entities/typeorm-city-region.entity';
import { TypeormCityEntity } from './database/entities/typeorm-city.entity';
import { TypeormCountryEntity } from './database/entities/typeorm-country.entity';
import { TypeormStateEntity } from './database/entities/typeorm-state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeormCountryEntity, TypeormStateEntity, TypeormCityEntity, TypeormCityRegionEntity]),
    HttpModule,
  ],
  providers: [CountriesSeeder],
})
export class CountryModule {}
