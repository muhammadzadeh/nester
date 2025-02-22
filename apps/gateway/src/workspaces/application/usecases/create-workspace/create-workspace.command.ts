import { AuthenticatedCommand } from '@repo/types';

export class CreateWorkspaceCommand extends AuthenticatedCommand {
	readonly title!: string;
	readonly logoId!: string | null;
}
