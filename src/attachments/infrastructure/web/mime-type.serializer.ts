import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class MimeTypeSerializer {
  @ApiProperty({
    type: 'ext',
  })
  @Expose()
  @Type(() => String)
  ext!: string;

  @ApiProperty({
    type: 'mime',
  })
  @Expose()
  @Type(() => String)
  mime!: string;
}
