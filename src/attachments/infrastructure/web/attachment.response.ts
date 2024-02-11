import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';
import { MimeTypeResponse } from './mime-type.response';
import { AttachmentId } from '../../domain/entities/attachment-users.entity';

export class AttachmentResponse {
  @ApiProperty({
    type: String,
    description: 'The attachment ID',
    example: 'a1b2c3d4e54as4df4',
  })
  @Expose()
  @Type(() => String)
  id!: AttachmentId;

  @ApiProperty({
    type: String,
    description: 'The attachment title',
    example: 'Passport image',
  })
  @Expose()
  @Type(() => String)
  title!: string | null;

  @ApiProperty({
    type: MimeTypeResponse,
    description: 'The attachment mime type',
    example: { ext: 'pdf', mime: 'application/pdf' },
    name: 'mime_type',
  })
  @Expose()
  @Type(() => MimeTypeResponse)
  mimeType!: MimeTypeResponse | null;

  @ApiProperty({
    type: AttachmentVisibility,
    enum: AttachmentVisibility,
    description: 'The attachment visibility type',
    example: AttachmentVisibility.PRIVATE,
  })
  @Expose()
  @Type(() => String)
  visibility!: AttachmentVisibility;

  @ApiProperty({
    type: Date,
    description: 'The attachment creation date',
    example: new Date(),
    name: 'created_at',
  })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: 'The attachment download link',
  })
  @Expose()
  @Type(() => String)
  url!: string;
}
