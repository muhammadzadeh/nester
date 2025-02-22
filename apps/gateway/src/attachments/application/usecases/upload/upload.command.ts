import { AuthenticatedCommand } from '@repo/types';
import { AttachmentVisibility } from '../../../domain/entities/attachments.entity';
import { FileInfo } from '../../storage-provider';

export class UploadCommand extends AuthenticatedCommand {
	readonly visibility!: AttachmentVisibility;
	readonly isDraft!: boolean;
	readonly file!: FileInfo;
	readonly storePath?: string;
	readonly workspaceId?: string;
}
