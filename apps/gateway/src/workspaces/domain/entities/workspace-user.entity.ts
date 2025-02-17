import { WorkspacePermission } from '@repo/types';
import { WorkspaceUserStatus } from '../enums/workspace-user-status.enum';
import { WorkspaceEntity } from './workspace.entity';

export class WorkspaceUserEntity {
	constructor(
		id: string,
		invitedByUserId: string,
		userId: string | null,
		workspaceId: string,
		roleId: string,
		email: string | null,
		mobile: string | null,
		token: string,
		status: WorkspaceUserStatus,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null,
	) {
		this.id = id;
		this.invitedByUserId = invitedByUserId;
		this.userId = userId;
		this.email = email;
		this.mobile = mobile;
		this.token = token;
		this.status = status;
		this.workspaceId = workspaceId;
		this.roleId = roleId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deletedAt = deletedAt;
	}

	readonly id!: string;
	readonly invitedByUserId!: string;
	userId!: string | null;
	readonly email!: string | null;
	readonly mobile!: string | null;
	readonly workspaceId!: string;
	readonly roleId!: string;
	readonly createdAt!: Date;
	updatedAt!: Date;
	deletedAt!: Date | null;
	token!: string;
	status!: WorkspaceUserStatus;

	workspace?: WorkspaceEntity;
	permissions?: WorkspacePermission[];
}
