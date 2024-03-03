import { Get, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadedFiles } from 'common/decorators';
import { CommonController } from 'common/guards/decorators';
import { CurrentUser } from '../../../authentication/infrastructure/web/decorators';
import { AttachmentsService, UploadAttachmentData } from '../../application/attachments.service';
import { AttachmentNotFoundException } from '../../domain/entities/attachments.entity';
import { AttachmentListResponse } from './attachment-list.response';
import { AttachmentVisibilityDto } from './attachment-visibility.dto';
import { DownloadAttachmentDto } from './download-attachment.dto';
import { FilesUploadDto } from './files-upload.dto';

@CommonController('/attachments')
@ApiTags('Attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':visibility')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: 201,
    type: AttachmentListResponse,
  })
  @ApiBody({ type: FilesUploadDto })
  async upload(
    @Param() visibilityDto: AttachmentVisibilityDto,
    @UploadedFiles() uploadedFiles: UploadedFiles,
    @CurrentUser() user: CurrentUser,
  ): Promise<AttachmentListResponse> {
    const items: UploadAttachmentData[] = [];
    for await (const file of uploadedFiles) {
      items.push({
        data: await file.toBuffer(),
        filename: file.filename,
        uploaderId: user.id,
        visibility: visibilityDto.visibility,
      });
    }
    const attachments = await this.attachmentsService.upload(items);

    return AttachmentListResponse.from(attachments);
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
