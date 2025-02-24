import { BaseCommand } from '@package/types';

export class DeleteAttachmentCommand extends BaseCommand {
	readonly attachmentId!: string;
}
