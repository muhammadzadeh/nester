import { BaseCommand } from '@package/types';

export class RemoveWorkspaceUserCommand extends BaseCommand {
	readonly workspaceUserId!: string;
}
