import { BaseCommand } from '@package/types';

export class RemoveAttachmentDraftFlagCommand extends BaseCommand {
	readonly attachmentIds!: string[];
}
