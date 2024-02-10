import { Get, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadedFiles } from 'common/decorators';
import { CommonController } from 'common/guards/decorators';
import { CurrentUser } from '../../../authenticate/infrastructure/web/decorators';
import { Serializer } from '../../../common/serialization';
import { AttachmentsService } from '../../application/attachments.service';
import { AttachmentNotFoundException } from '../../domain/entities/attachments.entity';
import { AttachmentVisibilityDto } from './attachment-visibility.dto';
import { DownloadAttachmentDto } from './download-attachment.dto';
import { FilesUploadDto } from './files-upload.dto';
import { PaginatedAttachmentSerializer } from './paginated-attachment.serializer';

@CommonController('/attachments')
@ApiTags('Attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':visibility')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 201,
    type: PaginatedAttachmentSerializer,
  })
  @ApiBody({ type: FilesUploadDto })
  async upload(
    @Param() visibilityDto: AttachmentVisibilityDto,
    @UploadedFiles() uploadedFiles: UploadedFiles,
    @CurrentUser() user: CurrentUser,
  ): Promise<PaginatedAttachmentSerializer> {
    const attachments = await this.attachmentsService.upload(uploadedFiles, visibilityDto.visibility, user.id);

    return Serializer.serialize(PaginatedAttachmentSerializer, {
      items: attachments,
    });
  }

  @Get(':id')
  async download(@Param() downloadDto: DownloadAttachmentDto, @CurrentUser() user: CurrentUser) {
    try {
      const attachmentRecord = await this.attachmentsService.findOneOrFail(downloadDto.id);
      const buffer = await this.attachmentsService.download(attachmentRecord, user.id);

      return new StreamableFile(buffer, {
        type: attachmentRecord.mimeType?.mime,
        length: attachmentRecord.size,
        disposition: `attachment; filename="${attachmentRecord.name}.${attachmentRecord.mimeType?.ext}"`,
      });
    } catch (error) {
      throw new AttachmentNotFoundException();
    }
  }
}
