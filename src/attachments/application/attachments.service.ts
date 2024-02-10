import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { isNumber } from 'lodash';
import { Configuration } from '../../common/config';
import { UploadedFiles } from '../../common/decorators';
import { UserId } from '../../common/types';
import { randomString } from '../../common/utils';
import { AttachmentId, AttachmentUserEntity } from '../domain/entities/attachment-users.entity';
import {
  AttachmentEntity,
  AttachmentNotFoundException,
  AttachmentVisibility,
  MimeType,
} from '../domain/entities/attachments.entity';
import {
  ATTACHMENT_USERS_REPOSITORY_TOKEN,
  AttachmentUsersRepository,
} from '../domain/repositories/attachment-users.repository';
import { ATTACHMENTS_REPOSITORY_TOKEN, AttachmentsRepository } from '../domain/repositories/attachments.repository';
import {
  AttachmentIsTooBigException,
  AttachmentsShouldNotBeEmptyException,
  InvalidAttachmentFormatException,
} from './exceptions';
import { AttachmentAccessInterface } from './interfaces';
import { FileInfo, UPLOADER_TOKEN, Uploader } from './uploader';

@Injectable()
export class AttachmentsService implements AttachmentAccessInterface {
  constructor(
    @Inject(ATTACHMENT_USERS_REPOSITORY_TOKEN) private readonly attachmentUsersRepository: AttachmentUsersRepository,
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN) private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(UPLOADER_TOKEN) private readonly uploader: Uploader,
    private readonly configurations: Configuration,
  ) {}

  async create(input: CreateAttachmentData): Promise<AttachmentEntity> {
    return await this.attachmentsRepository.save(
      new AttachmentEntity(
        input.originalName,
        input.randomName,
        input.originalName,
        input.fileSize,
        input.visibility,
        input.mimeType,
        input.uploaderId,
      ),
    );
  }

  async upload(
    uploadedFiles: UploadedFiles,
    visibility: AttachmentVisibility,
    uploaderId: UserId,
  ): Promise<AttachmentEntity[]> {
    const files: AttachmentEntity[] = [];

    for await (const file of uploadedFiles) {
      const originalName = file.filename;
      const fileBuffer = await file.toBuffer();
      const { fileSize, mimeType } = await this.extractFileInfo(fileBuffer);
      const randomName = await this.generateRandomName();
      const filePath = visibility === AttachmentVisibility.PRIVATE ? `${uploaderId}` : 'attachments';

      const attachmentRecord = await this.create({
        originalName,
        randomName,
        fileSize,
        visibility,
        mimeType,
        uploaderId,
      });

      await this.uploader.upload({
        path: filePath,
        name: randomName,
        mimeType: mimeType,
        data: fileBuffer,
        visibility: visibility,
      });

      files.push(attachmentRecord);
    }

    if (files.length === 0) {
      throw new AttachmentsShouldNotBeEmptyException();
    }

    return files;
  }

  async findOneOrFail(id: AttachmentId): Promise<AttachmentEntity> {
    const item = await this.attachmentsRepository.findOne({
      ids: [id],
    });

    if (!item) {
      throw new AttachmentNotFoundException();
    }
    return item;
  }

  async findManyById(attachments: AttachmentId[]): Promise<AttachmentEntity[]> {
    if (!attachments.length) {
      return [];
    }

    const result = await this.attachmentsRepository.findAll({ ids: attachments });
    return result.items;
  }

  async download(attachmentRecord: AttachmentEntity, userId: UserId): Promise<Buffer> {
    const canAccessAttachment = await this.canAccessAttachment(attachmentRecord, userId);
    if (!canAccessAttachment) {
      throw new AttachmentNotFoundException();
    }
    return this.uploader.download(attachmentRecord.getStoredPath(), attachmentRecord.visibility);
  }

  async delete(id: AttachmentId): Promise<void> {
    const attachmentRecord = await this.findOneOrFail(id);
    await this.uploader.delete(attachmentRecord.getStoredPath(), attachmentRecord.visibility);
    await this.attachmentsRepository.delete({ ids: [id] });
  }

  async canAccessAttachment(attachmentRecord: AttachmentEntity, userId: UserId): Promise<boolean> {
    const canAccessAttachment = await this.attachmentUsersRepository.exists({
      attachmentId: attachmentRecord.id,
      userId: `${userId}`,
    });

    return (
      attachmentRecord.isPublic() ||
      (attachmentRecord.uploaderId === userId && !!userId) ||
      (!isUUID(userId) && isNumber(+userId)) ||
      canAccessAttachment
    );
  }

  async grantAttachmentAccess(attachmentIds: AttachmentId[], userIds: UserId[]): Promise<void> {
    for (let j = 0; j < attachmentIds.length; j++) {
      const attachmentId = attachmentIds[j];
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        await this.attachmentUsersRepository.save(new AttachmentUserEntity(attachmentId, userId));
      }
    }
  }

  async revokeAttachmentAccess(attachmentId: AttachmentId, userIds: UserId[]): Promise<void>;
  async revokeAttachmentAccess(attachmentId: AttachmentId): Promise<void>;
  async revokeAttachmentAccess(attachmentId: AttachmentId, userIds?: UserId[]): Promise<void> {
    if (attachmentId && userIds) {
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        await this.attachmentUsersRepository.delete({
          attachmentId: attachmentId,
          userId: userId,
        });
      }
    } else if (attachmentId) {
      await this.attachmentUsersRepository.delete({
        attachmentId: attachmentId,
      });
    }
  }

  private static async detectType(buffer: Buffer): Promise<any> {
    const { fileTypeFromBuffer } = await import('file-type');
    return fileTypeFromBuffer(buffer);
  }

  private async generateRandomName(): Promise<string> {
    return await randomString({ length: 100, type: 'alphanumeric' });
  }

  private async extractFileInfo(buffer: Buffer): Promise<FileInfo> {
    const mimeType: FileInfo['mimeType'] | undefined = await AttachmentsService.detectType(buffer);
    const fileSize = Buffer.byteLength(buffer);
    const storageConfig = this.configurations.storage;

    // check file mimeType
    if (typeof mimeType === 'undefined' || !SupportedMimeTypes.includes(mimeType.ext)) {
      throw new InvalidAttachmentFormatException();
    }

    // check file size
    if (fileSize > storageConfig.maxFileSize) {
      throw new AttachmentIsTooBigException();
    }

    return {
      buffer: buffer,
      mimeType,
      fileSize,
    };
  }
}

const SupportedMimeTypes = [
  'jpg',
  'png',
  'mp4',
  'mid',
  'mkv',
  'webm',
  'mov',
  'avi',
  'mpg',
  'mp2',
  'mp3',
  'm4a',
  'ogg',
  'pdf',
  'vcf',
  'doc',
  'docx',
  'ppt',
];

export class CreateAttachmentData {
  readonly originalName!: string;
  readonly randomName!: string;
  readonly fileSize!: number;
  readonly visibility!: AttachmentVisibility;
  readonly mimeType!: MimeType;
  readonly uploaderId!: UserId;
}
