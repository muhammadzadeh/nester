import { BaseCommand } from '../../../../../common/commands/base.command';

export class RemoveAttachmentDraftFlagCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
