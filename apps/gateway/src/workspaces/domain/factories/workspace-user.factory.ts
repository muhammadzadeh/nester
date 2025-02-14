import { now } from '@repo/utils/time';
import { randomUUID } from 'crypto';
import { WorkspaceUserEntity } from '../entities/workspace-user.entity';

export class WorkspaceUserReadFactory {
	static create(args: WorkspaceUserEntity): WorkspaceUserEntity {
		return new WorkspaceUserEntity(
			args.id,
			args.userId,
			args.workspaceId,
			args.roleId,
			args.createdAt,
			args.updatedAt,
			args.deletedAt,
		);
	}
}

export class WorkspaceUserWriteFactory {
	static create(args: Omit<WorkspaceUserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): WorkspaceUserEntity {
		return new WorkspaceUserEntity(
			randomUUID(),
			args.userId,
			args.workspaceId,
			args.roleId,
			now().toJSDate(),
			now().toJSDate(),
			null,
		);
	}
}
