import { BaseCommand, PaginationOption } from '@package/types';
import {
	FindWorkspaceUserOptions,
	WorkspaceUserOrderBy,
} from '../../../domain/repositories/workspace-users.repository';

export class FindWorkspaceUsersQuery extends BaseCommand {
	readonly conditions!: Partial<FindWorkspaceUserOptions>;
	readonly pagination?: PaginationOption<WorkspaceUserOrderBy>;
}
