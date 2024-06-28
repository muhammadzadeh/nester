import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MimeTypeResponse {
  @ApiProperty({
    type: String,
    name: 'ext',
  })
  @Type(() => String)
  ext!: string;

  @ApiProperty({
    type: String,
    name: 'mime',
  })
  @Type(() => String)
  mime!: string;
}
