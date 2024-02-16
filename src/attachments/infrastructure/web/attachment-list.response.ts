import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListResponse } from '../../../common/serialization';
import { AttachmentResponse } from './attachment.response';

export class AttachmentListResponse extends ListResponse<AttachmentResponse> {
  @ApiProperty({
    type: AttachmentResponse,
    isArray: true,
    description: 'The Attachments',
  })
  @Expose()
  @Type(() => AttachmentResponse)
  declare items: AttachmentResponse[];
}
