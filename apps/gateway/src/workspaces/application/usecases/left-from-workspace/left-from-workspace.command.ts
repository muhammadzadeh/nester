import { AuthenticatedCommand } from '@repo/types';

export class LeftFromWorkspaceCommand extends AuthenticatedCommand {
	readonly workspaceId!: string;
}
