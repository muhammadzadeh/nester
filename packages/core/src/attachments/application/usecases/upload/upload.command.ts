import { AuthenticatedCommand } from '../../../../common/commands/authenticated.command';
import { AttachmentVisibility } from '../../../domain/entities/attachments.entity';

export interface UploadedFiles {
  buffer: Buffer;
  name: string;
}

export class UploadCommand extends AuthenticatedCommand {
  readonly visibility!: AttachmentVisibility;
  readonly isDraft!: boolean;
  readonly files!: UploadedFiles[];
}
