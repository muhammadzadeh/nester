import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AttachmentSerializer } from './attachment.serializer';

export class PaginatedAttachmentSerializer {
  @ApiProperty({
    type: AttachmentSerializer,
    isArray: true,
    description: 'The Attachments',
  })
  @Expose()
  @Type(() => AttachmentSerializer)
  items!: AttachmentSerializer[];
}
