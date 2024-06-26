import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentEntity } from '../../domain/entities/attachments.entity';
import { AttachmentResponse } from './attachment.response';
import { ListResponse } from '../../../../common/serialization';

export class AttachmentListResponse extends ListResponse<AttachmentResponse> {
  static from(data: AttachmentEntity[]): AttachmentListResponse {
    return new AttachmentListResponse(data, {
      total: data.length,
    });
  }

  @ApiProperty({
    type: AttachmentResponse,
    isArray: true,
    description: 'The Attachments',
  })
  @Type(() => AttachmentResponse)
  declare items: AttachmentResponse[];
}
