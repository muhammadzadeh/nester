import { UserId } from '../common.types';
import { AuthenticatedCommand } from './authenticated.command';

export abstract class WorkspaceAuthenticatedCommand extends AuthenticatedCommand {
	public readonly workspaceId!: UserId;
}
