import { AuthenticatedCommand } from '@repo/types';

export class AddUserToWorkspaceCommand extends AuthenticatedCommand {
	readonly mobile!: string | null;
	readonly email!: string | null;
	readonly workspaceId!: string;
	readonly roleId!: string;
}
