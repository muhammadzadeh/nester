import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CountriesSeeder } from '../application/countries.seeder';

@Module({
  imports: [HttpModule],
  providers: [CountriesSeeder],
})
export class CountryModule {}
