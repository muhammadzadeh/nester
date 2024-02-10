import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
export class NotificationCTASerializerForUser{
  @ApiProperty({
    type: String,
    description: 'The cta title',
    example: 'Verify your email',
  })
  @Expose()
  @Type(() => String)
  title!: string;

  @ApiProperty({
    type: String,
    description: 'the cta url',
    example: 'https://example.com',
  })
  @Expose()
  @Type(() => String)
  url!: string;

  @ApiProperty({
    type: Boolean,
    description: 'is main cta',
    example: false,
    name:'is_main'
  })
  @Expose()
  @Type(() => Boolean)
  isMain!: boolean;
}
