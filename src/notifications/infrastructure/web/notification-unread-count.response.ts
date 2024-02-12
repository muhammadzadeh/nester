import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
export class NotificationUnreadCountResponse {
  @ApiProperty({
    type: Number,
    description: 'unread count',
    example: 10,
  })
  @Expose()
  @Type(() => Number)
  count!: number;
}
