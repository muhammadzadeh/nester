import { BaseCommand } from '@repo/types';

export class RemoveWorkspaceUserCommand extends BaseCommand {
	readonly workspaceUserId!: string;
}
