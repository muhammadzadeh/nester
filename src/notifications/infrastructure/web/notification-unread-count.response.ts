import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
export class NotificationUnreadCountResponse {
  static from(count: number): NotificationUnreadCountResponse {
    return { count };
  }

  @ApiProperty({
    type: Number,
    description: 'unread count',
    example: 10,
  })
  @Expose()
  @Type(() => Number)
  count!: number;
}
