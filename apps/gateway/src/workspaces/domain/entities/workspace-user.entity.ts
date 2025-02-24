import { ForbiddenStatusChangeException } from '@package/exception';
import { now } from '@package/utils/time';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
import { RoleEntity } from '../../../users/roles/domain/entities/role.entity';
import { WorkspaceUserStatus } from '../enums/workspace-user-status.enum';
import { WorkspaceEntity } from './workspace.entity';

export class WorkspaceUserEntity {
	private readonly stateMachine = new Map<WorkspaceUserStatus, Set<WorkspaceUserStatus>>([
		[WorkspaceUserStatus.ACCEPTED, new Set([])],
		[WorkspaceUserStatus.PENDING, new Set([WorkspaceUserStatus.REJECTED, WorkspaceUserStatus.ACCEPTED])],
		[WorkspaceUserStatus.REJECTED, new Set([])],
	]);

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
		respondedAt: Date | null,
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
		this.respondedAt = respondedAt;
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
	respondedAt!: Date | null;
	token!: string;
	status!: WorkspaceUserStatus;

	workspace?: WorkspaceEntity;
	role?: RoleEntity;
	user?: UserEntity;

	markAsAccepted(userId: string): void {
		this.changeStatus(WorkspaceUserStatus.ACCEPTED);
		this.userId = userId;
		this.respondedAt = now().toJSDate();
	}

	markAsRejected(userId: string): void {
		this.changeStatus(WorkspaceUserStatus.REJECTED);
		this.userId = userId;
		this.respondedAt = now().toJSDate();
	}

	canRespond(): boolean {
		return this.status === WorkspaceUserStatus.PENDING;
	}

	markAsDeleted(): void {
		this.deletedAt = now().toJSDate();
	}

	private changeStatus(newStatus: WorkspaceUserStatus): void {
		if (!this.stateMachine.get(this.status)?.has(newStatus)) {
			throw new ForbiddenStatusChangeException(
				`Can't change workspace user(${this.id}) status from ${this.status} to ${newStatus}`,
			);
		}

		this.status = newStatus;
	}
}
