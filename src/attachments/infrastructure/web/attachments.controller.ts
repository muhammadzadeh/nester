import { Get, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../authentication/infrastructure/web/decorators';
import { CommonController } from '../../../../common/guards/decorators';
import { AttachmentsService } from '../../application/attachments.service';
import { UploadedFiles } from '../../application/usecases/upload/upload.command';
import { AttachmentNotFoundException } from '../../domain/entities/attachments.entity';
import { AttachmentListResponse } from './attachment-list.response';
import { AttachmentVisibilityDto } from './attachment-visibility.dto';
import { GetUploadedFiles } from './decorators';
import { DownloadAttachmentDto, DownloadSharedAttachmentDto } from './download-attachment.dto';
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
  @ApiOperation({
    operationId: 'upload',
  })
  @ApiBody({ type: FilesUploadDto })
  async upload(
    @Param() visibilityDto: AttachmentVisibilityDto,
    @GetUploadedFiles() uploadedFiles: UploadedFiles,
    @CurrentUser() user: CurrentUser,
  ): Promise<AttachmentListResponse> {
    const attachments = await this.attachmentsService.upload({
      files: uploadedFiles,
      visibility: visibilityDto.visibility,
      userId: user.id,
      isDraft: false,
    });

    return AttachmentListResponse.from(attachments);
  }

  @ApiOperation({
    operationId: 'download',
  })
  @Get(':id')
  async download(@Param() downloadDto: DownloadAttachmentDto, @CurrentUser() user: CurrentUser) {
    try {
      const { attachment, buffer } = await this.attachmentsService.download({
        attachmentId: downloadDto.id,
        userId: user.id,
      });

      const encodedFilename = encodeURIComponent(attachment.name.replace(/\s+/g, '+'));

      return new StreamableFile(buffer, {
        type: attachment.mimeType?.mime,
        length: attachment.size,
        disposition: `attachment; filename*=UTF-8''${encodedFilename}`,
      });
    } catch (error) {
      throw new AttachmentNotFoundException();
    }
  }

  @ApiOperation({
    operationId: 'downloadShared',
  })
  @Get('share/:id')
  async downloadShared(@Param() downloadDto: DownloadSharedAttachmentDto) {
    try {
      const { attachment, buffer } = await this.attachmentsService.download({
        attachmentId: downloadDto.id,
      });

      const encodedFilename = encodeURIComponent(attachment.name.replace(/\s+/g, '+'));

      return new StreamableFile(buffer, {
        type: attachment.mimeType?.mime,
        length: attachment.size,
        disposition: `attachment; filename*=UTF-8''${encodedFilename}`,
      });
    } catch (error) {
      throw new AttachmentNotFoundException();
    }
  }
}
