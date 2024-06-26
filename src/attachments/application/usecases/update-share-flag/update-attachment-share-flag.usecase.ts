import { Inject, Injectable } from '@nestjs/common';
import {
  ATTACHMENTS_REPOSITORY_TOKEN,
  AttachmentsRepository,
} from '../../../domain/repositories/attachments.repository';
import { UpdateAttachmentShareFlagCommand } from './update-attachment-share-flag.command';

@Injectable()
export class UpdateAttachmentShareFlagUsecase {
  constructor(
    @Inject(ATTACHMENTS_REPOSITORY_TOKEN)
    private readonly attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute(command: UpdateAttachmentShareFlagCommand): Promise<void> {
    if (!command.attachmentIds.length) {
      return;
    }

    const attachments = await this.attachmentsRepository.findMany({
      ids: command.attachmentIds,
    });

    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      await attachment.updateSharedFlag(command.isShared);
      await this.attachmentsRepository.save(attachment);
    }
  }
}
