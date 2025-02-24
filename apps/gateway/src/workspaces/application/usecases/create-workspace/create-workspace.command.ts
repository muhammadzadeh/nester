import { AuthenticatedCommand } from '@package/types';

export class CreateWorkspaceCommand extends AuthenticatedCommand {
	readonly title!: string;
	readonly logoId!: string | null;
}
