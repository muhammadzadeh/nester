import { Paginated, PaginationOption } from '@repo/types';
import { WorkspaceEntity } from '../entities/workspace.entity';

export interface FindWorkspaceOptions {
	ids: string[];
}

export enum WorkspaceOrderBy {
	CREATED_AT = 'created_at',
}

export abstract class WorkspacesRepository {
	abstract save(data: WorkspaceEntity): Promise<WorkspaceEntity>;
	abstract findOne(options: Partial<FindWorkspaceOptions>): Promise<WorkspaceEntity | null>;
	abstract findAll(
		options: Partial<FindWorkspaceOptions>,
		pagination?: PaginationOption<WorkspaceOrderBy>,
	): Promise<Paginated<WorkspaceEntity>>;
	abstract exists(options: Partial<FindWorkspaceOptions>): Promise<boolean>;
	abstract update(options: Partial<FindWorkspaceOptions>, data: Partial<WorkspaceEntity>): Promise<void>;
}
