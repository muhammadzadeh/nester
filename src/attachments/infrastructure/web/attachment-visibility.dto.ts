import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttachmentVisibility } from '../../domain/entities/attachments.entity';

export class AttachmentVisibilityDto {
  @ApiProperty({
    required: true,
    type: AttachmentVisibility,
    enum: AttachmentVisibility,
    enumName: 'AttachmentVisibility',
    description: 'the attachment visibility type',
  })
  @IsNotEmpty()
  @IsEnum(AttachmentVisibility)
  visibility!: AttachmentVisibility;
}
