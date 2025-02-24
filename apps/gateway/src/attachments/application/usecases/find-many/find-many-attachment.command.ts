import { BaseCommand } from '@package/types';

export class FindManyAttachmentCommand extends BaseCommand {
	readonly attachmentIds!: string[];
}
