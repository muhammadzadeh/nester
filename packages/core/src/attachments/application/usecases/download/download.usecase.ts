import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { AttachmentEntity, AttachmentNotFoundException } from '../../../domain/entities/attachments.entity';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { STORAGE_PROVIDER_TOKEN, StorageProvider } from '../../storage-provider';
import { DownloadCommand } from './download.command';

@Injectable()
export class DownloadUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
  ) {}

  async execute(command: DownloadCommand): Promise<DownloadAttachmentResult> {
    const attachmentRecord = await this.findAttachmentOrFail(command.attachmentId);

    if (command.userId) {
      await this.canAccessAttachment(attachmentRecord, command.userId);
    }

    const bufferedAttachment = await this.storageProvider.download(attachmentRecord.getPathAndName());
    return {
      attachment: attachmentRecord,
      buffer: bufferedAttachment,
    };
  }

  private async findAttachmentOrFail(id: string): Promise<AttachmentEntity> {
    const item = await this.attachmentsRepository.findOne({
      ids: isUUID(id) ? [id] : undefined,
      shareTokens: !isUUID(id) ? [id] : undefined,
    });

    if (!item) {
      throw new AttachmentNotFoundException(`Attachment not found with id ${id}`);
    }
    return item;
  }

  //TODO move this method  to controller use guard
  private async canAccessAttachment(attachmentRecord: AttachmentEntity, userId: string): Promise<void> {
    const canAccessAttachment = attachmentRecord.isPublic() || (attachmentRecord.uploaderId === userId && !!userId);

    if (!canAccessAttachment) {
      throw new AttachmentNotFoundException(`User ${userId} can not access attachment ${attachmentRecord.id}`);
    }
  }
}

export interface DownloadAttachmentResult {
  readonly attachment: AttachmentEntity;
  readonly buffer: Buffer;
}
