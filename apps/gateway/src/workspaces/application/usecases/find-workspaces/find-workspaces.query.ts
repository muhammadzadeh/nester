import { BaseCommand, PaginationOption } from '@repo/types';
import { FindWorkspaceUserOptions } from '../../../domain/repositories/workspace-users.repository';
import { WorkspaceOrderBy } from '../../../domain/repositories/workspaces.repository';

export class FindWorkspacesQuery extends BaseCommand {
	readonly conditions!: Partial<FindWorkspaceUserOptions>;
	readonly pagination?: PaginationOption<WorkspaceOrderBy>;
}
