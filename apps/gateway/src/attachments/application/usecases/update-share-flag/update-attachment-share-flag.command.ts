import { BaseCommand } from '@package/types';

export class UpdateAttachmentShareFlagCommand extends BaseCommand {
	readonly attachmentIds!: string[];
	readonly isShared!: boolean;
}
