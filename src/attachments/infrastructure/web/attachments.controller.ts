import { Get, Param, Post, Req, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CurrentUser } from '../../../authentication/infrastructure/web/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { AttachmentsService } from '../../application/attachments.service';
import { UploadedFiles } from '../../application/usecases/upload/upload.command';
import { AttachmentNotFoundException } from '../../domain/entities/attachments.entity';
import { AttachmentListResponse } from './attachment-list.response';
import { AttachmentVisibilityDto } from './attachment-visibility.dto';
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
    @CurrentUser() user: CurrentUser,
    @Req() request: FastifyRequest,
  ): Promise<AttachmentListResponse> {
    const uploadedFiles = request.files();
    const files: UploadedFiles[] = [];
    for await (const file of uploadedFiles) {
      files.push({
        buffer: await file.toBuffer(),
        name: file.fieldname,
      });
    }

    const attachments = await this.attachmentsService.upload({
      files: files,
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
