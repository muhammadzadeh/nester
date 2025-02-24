import { WorkspaceAuthenticatedCommand } from '@package/types';

export class AddUserToWorkspaceCommand extends WorkspaceAuthenticatedCommand {
	readonly mobile!: string | null;
	readonly email!: string | null;
	readonly roleId!: string;
}
