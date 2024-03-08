import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CountryEntity } from '../../domain/entities/country.entity';
import { TimezoneResponse } from './timezone.response';

export class CountryResponse {
  static from(data: CountryEntity): CountryResponse {
    return {
      id: data.id,
      name: data.name,
      emoji: data.emoji,
      iso2: data.iso2,
      iso3: data.iso3,
      phoneCode: data.phoneCode,
      timezones: data.timezones.map((timezone) => TimezoneResponse.from(timezone)),
    };
  }

  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
    name: 'name',
  })
  @Type(() => String)
  readonly name!: string;

  @ApiProperty({
    type: String,
    name: 'iso3',
  })
  @Type(() => String)
  readonly iso3!: string;

  @ApiProperty({
    type: String,
    name: 'iso2',
  })
  @Type(() => String)
  readonly iso2!: string;

  @ApiProperty({
    type: String,
    name: 'phone_code',
  })
  @Type(() => String)
  readonly phoneCode!: string;

  @ApiProperty({
    type: TimezoneResponse,
    name: 'timezones',
    isArray: true,
  })
  @Type(() => TimezoneResponse)
  readonly timezones!: TimezoneResponse[];

  @ApiProperty({
    type: String,
    name: 'emoji',
    nullable: true,
  })
  @Type(() => String)
  readonly emoji!: string;
}
