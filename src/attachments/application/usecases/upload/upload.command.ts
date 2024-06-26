import { MultipartFile } from '@fastify/multipart';
import { AuthenticatedCommand } from '../../../../../common/commands/authenticated.command';
import { AttachmentVisibility } from '../../../domain/entities/attachments.entity';

export type UploadedFiles = AsyncIterableIterator<MultipartFile>;

export class UploadCommand extends AuthenticatedCommand {
  readonly visibility!: AttachmentVisibility;
  readonly isDraft!: boolean;
  readonly files!: UploadedFiles;
}
