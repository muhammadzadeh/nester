import { randomStringSync } from '@repo/utils/string';
import { now } from '@repo/utils/time';
import { randomInt, randomUUID } from 'crypto';
import { WorkspaceUserEntity } from '../entities/workspace-user.entity';
import { WorkspaceUserStatus } from '../enums/workspace-user-status.enum';

export class WorkspaceUserReadFactory {
	static create(args: Omit<WorkspaceUserEntity, 'markAsAccepted' | 'markAsRejected'>): WorkspaceUserEntity {
		return new WorkspaceUserEntity(
			args.id,
			args.invitedByUserId,
			args.userId,
			args.workspaceId,
			args.roleId,
			args.email,
			args.mobile,
			args.token,
			args.status,
			args.createdAt,
			args.updatedAt,
			args.deletedAt,
			args.respondedAt,
		);
	}
}

export class WorkspaceUserWriteFactory {
	static create(
		args: Omit<
			WorkspaceUserEntity,
			| 'id'
			| 'createdAt'
			| 'updatedAt'
			| 'deletedAt'
			| 'token'
			| 'status'
			| 'respondedAt'
			| 'markAsAccepted'
			| 'markAsRejected'
		>,
	): WorkspaceUserEntity {
		const tokenLength = randomInt(20, 40);
		const token = randomStringSync({ type: 'url-safe', length: tokenLength });
		return new WorkspaceUserEntity(
			randomUUID(),
			args.invitedByUserId,
			args.userId,
			args.workspaceId,
			args.roleId,
			args.email,
			args.mobile,
			token,
			WorkspaceUserStatus.PENDING,
			now().toJSDate(),
			now().toJSDate(),
			null,
			null,
		);
	}
}
