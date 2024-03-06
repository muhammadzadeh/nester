import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CityRegionEntity } from '../../domain/entities/city-region.entity';

export class CityRegionResponse {
  static from(data: CityRegionEntity): CityRegionResponse {
    return {
      id: data.id,
      name: data.name,
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
}
