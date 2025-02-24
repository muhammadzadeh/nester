import { AuthenticatedCommand } from '@package/types';
import { WorkspaceUserStatus } from '../../../domain/enums/workspace-user-status.enum';

export class RespondInvitationCommand extends AuthenticatedCommand {
	readonly token!: string;
	readonly status!: WorkspaceUserStatus;
}
