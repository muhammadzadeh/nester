import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AttachmentResponse } from './attachment.response';

export class AttachmentListResponse {
  @ApiProperty({
    type: AttachmentResponse,
    isArray: true,
    description: 'The Attachments',
  })
  @Expose()
  @Type(() => AttachmentResponse)
  items!: AttachmentResponse[];
}
