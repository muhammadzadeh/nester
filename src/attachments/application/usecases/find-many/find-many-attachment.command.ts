import { BaseCommand } from '../../../../../common/commands/base.command';

export class FindManyAttachmentCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
