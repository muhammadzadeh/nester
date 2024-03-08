import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Timezone } from '../../domain/entities/country.entity';

export class TimezoneResponse {
  static from(data: Timezone): TimezoneResponse {
    return {
      zoneName: data.zoneName,
      gmtOffsetName: data.gmtOffsetName,
    };
  }
  @ApiProperty({
    type: String,
    name: 'zone_name',
  })
  @Type(() => String)
  readonly zoneName!: string;

  @ApiProperty({
    type: String,
    name: 'gmt_offset_name',
  })
  @Type(() => String)
  readonly gmtOffsetName!: string;
}
