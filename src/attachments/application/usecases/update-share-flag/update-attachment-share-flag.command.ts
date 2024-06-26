import { BaseCommand } from '../../../../../common/commands/base.command';

export class UpdateAttachmentShareFlagCommand extends BaseCommand {
  readonly attachmentIds!: string[];
  readonly isShared!: boolean;
}
