import { BaseCommand } from '../../../../../common/commands/base.command';

export interface GrantAttachmentAccess {
  readonly attachmentIds: string[];
  readonly userIds: number[];
}

export interface RevokeAttachmentAccess {
  readonly attachmentId: string;
  readonly userIds?: number[];
}

export class UpdateAttachmentAccessCommand extends BaseCommand {
  readonly grant?: GrantAttachmentAccess;
  readonly revoke?: RevokeAttachmentAccess;
}
