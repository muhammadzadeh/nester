import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class NotificationUnreadCountResponse {
  @ApiProperty({
    type: Number,
    description: 'unread count',
    example: 10,
  })
  @Type(() => Number)
  count!: number;
}
