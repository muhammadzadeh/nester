import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Exception } from '../../../../common/exception';
import { AttachmentEntity, AttachmentVisibility } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { FileInfo, STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { UploadCommand } from './upload.command';

@Injectable()
export class UploadUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(command: UploadCommand): Promise<AttachmentEntity> {
    await this.validateFile(command.file);

    const filePath = this.getFileStorePath(command);

    const createdAttachment = new AttachmentEntity(
      command.file.originalName,
      command.visibility,
      command.file.mimeType,
      command.userId,
      command.isDraft,
      filePath,
    );

    await this.storageProvider.upload({
      path: createdAttachment.getPathAndName(),
      mimeType: command.file.mimeType,
      fileData: command.file.fileData,
    });

    const savedAttachment = await this.attachmentsRepository.save(createdAttachment);

    return savedAttachment;
  }

  private getFileStorePath(command: UploadCommand): string {
    if (command.storePath) {
      return command.storePath;
    }

    return command.visibility === AttachmentVisibility.PRIVATE
      ? `${this.storageProvider.getPrivateBucketName()}/${command.userId}`
      : `${this.storageProvider.getPublicBucketName()}/attachments`;
  }

  private async validateFile(file: FileInfo): Promise<void> {
    if (!file.mimeType.ext || !file.mimeType.mime) {
      throw new InvalidAttachmentFormatException(`Unknown file format!`);
    }

    if (!SupportedMimeTypes.has(file.mimeType.mime)) {
      throw new InvalidAttachmentFormatException(`${file.mimeType.mime} is not supported!`);
    }
  }
}

const SupportedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'video/mp4',
  'audio/midi',
  'video/x-matroska',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
  'audio/mpeg',
  'audio/mpeg',
  'audio/x-m4a',
  'audio/ogg',
  'application/pdf',
  'text/vcard',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'image/webp',
  'application/sql'
]);

@Exception({
  errorCode: 'ATTACHMENT_IS_TOO_BIG',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class AttachmentIsTooBigException extends Error {}

@Exception({
  errorCode: 'INVALID_FORMAT',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class InvalidAttachmentFormatException extends Error {}

@Exception({
  errorCode: 'ATTACHMENT_LIST_EMPTY',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class AttachmentsShouldNotBeEmptyException extends Error {}
