import { AuthenticatedCommand } from '@package/types';

export class LeftFromWorkspaceCommand extends AuthenticatedCommand {
	readonly workspaceId!: string;
}
