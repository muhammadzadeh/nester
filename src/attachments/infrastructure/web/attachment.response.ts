import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentId } from '../../domain/entities/attachment-users.entity';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';
import { MimeTypeResponse } from './mime-type.response';

export class AttachmentResponse {
  @ApiProperty({
    type: String,
    description: 'The attachment ID',
    example: 'a1b2c3d4e54as4df4',
  })
  @Type(() => String)
  id!: AttachmentId;

  @ApiProperty({
    type: String,
    description: 'The attachment title',
    example: 'Passport image',
  })
  @Type(() => String)
  title!: string | null;

  @ApiProperty({
    type: MimeTypeResponse,
    description: 'The attachment mime type',
    example: { ext: 'pdf', mime: 'application/pdf' },
    name: 'mime_type',
  })
  @Type(() => MimeTypeResponse)
  mimeType!: MimeTypeResponse | null;

  @ApiProperty({
    type: AttachmentVisibility,
    enum: AttachmentVisibility,
    enumName: 'AttachmentVisibility',
    description: 'The attachment visibility type',
  })
  @Type(() => String)
  visibility!: AttachmentVisibility;

  @ApiProperty({
    type: Date,
    description: 'The attachment creation date',
    example: new Date(),
    name: 'created_at',
  })
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: 'The attachment download link',
  })
  @Type(() => String)
  url!: string;
}
