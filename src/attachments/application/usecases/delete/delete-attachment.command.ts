import { BaseCommand } from '../../../../../common/commands/base.command';

export class DeleteAttachmentCommand extends BaseCommand {
  readonly attachmentId!: string;
}
