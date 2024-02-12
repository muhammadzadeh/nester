import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MimeTypeResponse {
  @ApiProperty({
    type: String,
  })
  @Expose()
  @Type(() => String)
  ext!: string;

  @ApiProperty({
    type: String,
  })
  @Expose()
  @Type(() => String)
  mime!: string;
}
