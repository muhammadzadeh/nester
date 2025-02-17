import { Paginated, PaginationOption } from '@repo/types';
import { WorkspaceUserEntity } from '../entities/workspace-user.entity';
import { WorkspaceUserStatus } from '../enums/workspace-user-status.enum';

export interface FindWorkspaceUserOptions {
	ids: string[];
	userIds: string[];
	workspaceIds: string[];
	roleIds: string[];
	emails: string[];
	mobiles: string[];
	statuses: WorkspaceUserStatus[];
}

export enum WorkspaceUserOrderBy {
	CREATED_AT = 'created_at',
}

export abstract class WorkspaceUsersRepository {
	abstract save(data: WorkspaceUserEntity): Promise<WorkspaceUserEntity>;
	abstract findOne(options: Partial<FindWorkspaceUserOptions>): Promise<WorkspaceUserEntity | null>;
	abstract findAll(
		options: Partial<FindWorkspaceUserOptions>,
		pagination?: PaginationOption<WorkspaceUserOrderBy>,
	): Promise<Paginated<WorkspaceUserEntity>>;
	abstract exists(options: Partial<FindWorkspaceUserOptions>): Promise<boolean>;
	abstract update(options: Partial<FindWorkspaceUserOptions>, data: Partial<WorkspaceUserEntity>): Promise<void>;
}
