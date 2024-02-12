import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentResponse } from './attachment.response';

export class AttachmentListResponse {
  @ApiProperty({
    type: AttachmentResponse,
    isArray: true,
    description: 'The Attachments',
  })
  @Type(() => AttachmentResponse)
  items!: AttachmentResponse[];
}
