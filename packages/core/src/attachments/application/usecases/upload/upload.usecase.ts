import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Configuration } from '../../../../common/config';
import { Exception } from '../../../../common/exception';
import { AttachmentEntity, AttachmentVisibility, MimeType } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { ExtendedMemeType, FileInfo, STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { UploadCommand, UploadedFiles } from './upload.command';

@Injectable()
export class UploadUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
    private readonly configurations: Configuration,
  ) {}

  async execute(command: UploadCommand): Promise<AttachmentEntity[]> {
    const files: AttachmentEntity[] = [];

    for (const file of command.files) {
      const { fileSize, mimeType, fileBuffer, originalName } = await this.extractFileInfo(file);

      const createdAttachment = await this.create({
        originalName,
        fileSize,
        visibility: command.visibility,
        mimeType,
        uploaderId: command.userId,
        isDraft: command.isDraft,
      });

      await this.storageProvider.upload({
        path: createdAttachment.getPathAndName(),
        mimeType: mimeType,
        data: fileBuffer,
      });

      files.push(createdAttachment);
    }

    if (files.length === 0) {
      throw new AttachmentsShouldNotBeEmptyException();
    }

    return files;
  }

  async create(input: CreateAttachmentData): Promise<AttachmentEntity> {
    return await this.attachmentsRepository.save(
      new AttachmentEntity(
        input.originalName,
        input.fileSize,
        input.visibility,
        input.mimeType,
        input.uploaderId,
        input.isDraft,
      ),
    );
  }

  private async detectType(buffer: Buffer): Promise<any> {
    const { fileTypeFromBuffer } = await import('file-type');
    return fileTypeFromBuffer(buffer);
  }

  private async extractFileInfo(file: UploadedFiles): Promise<FileInfo> {
    const originalName = file.name;
    const fileBuffer = file.buffer;

    const mimeType: ExtendedMemeType | undefined = await this.detectType(fileBuffer);

    const storageConfig = this.configurations.storage;

    if (!mimeType || !mimeType.ext || !mimeType.mime) {
      throw new InvalidAttachmentFormatException(`Unknown file format!`);
    }

    if (!SupportedMimeTypes.has(mimeType.mime)) {
      throw new InvalidAttachmentFormatException(`${mimeType.mime} is not supported!`);
    }

    const fileSize = Buffer.byteLength(fileBuffer);
    if (fileSize > storageConfig.maxFileSize) {
      throw new AttachmentIsTooBigException(
        `current file size is ${fileSize}b that greater than max file size ${storageConfig.maxFileSize}b`,
      );
    }

    return {
      fileBuffer,
      mimeType,
      fileSize,
      originalName,
    };
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
]);

interface CreateAttachmentData {
  originalName: string;
  fileSize: number;
  visibility: AttachmentVisibility;
  mimeType: MimeType;
  uploaderId: string;
  isDraft: boolean;
}

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
