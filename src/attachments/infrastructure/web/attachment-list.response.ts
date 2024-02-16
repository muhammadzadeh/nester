import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListResponse } from '../../../common/serialization';
import { AttachmentEntity } from '../../domain/entities/attachments.entity';
import { AttachmentResponse } from './attachment.response';

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
  @Expose()
  @Type(() => AttachmentResponse)
  declare items: AttachmentResponse[];
}
