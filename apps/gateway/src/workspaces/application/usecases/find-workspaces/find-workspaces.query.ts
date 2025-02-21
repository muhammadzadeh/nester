import { AuthenticatedCommand, PaginationOption } from '@repo/types';
import { FindWorkspaceOptions, WorkspaceOrderBy } from '../../../domain/repositories/workspaces.repository';

export class FindWorkspacesQuery extends AuthenticatedCommand {
	readonly conditions!: Partial<FindWorkspaceOptions>;
	readonly pagination?: PaginationOption<WorkspaceOrderBy>;
}
