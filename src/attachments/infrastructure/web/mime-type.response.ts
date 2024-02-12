import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MimeTypeResponse {
  @ApiProperty({
    type: 'ext',
  })
  @Type(() => String)
  ext!: string;

  @ApiProperty({
    type: 'mime',
  })
  @Type(() => String)
  mime!: string;
}
