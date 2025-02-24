import { now } from '@package/utils/time';
import { randomUUID } from 'crypto';
import { WorkspaceEntity } from '../entities/workspace.entity';

export class WorkspaceReadFactory {
	static create(args: Omit<WorkspaceEntity, 'logo'>): WorkspaceEntity {
		return new WorkspaceEntity(
			args.id,
			args.title,
			args.logoId,
			args.creatorId,
			args.createdAt,
			args.updatedAt,
			args.deletedAt,
		);
	}
}

export class WorkspaceWriteFactory {
	static create(args: Omit<WorkspaceEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'logo'>): WorkspaceEntity {
		return new WorkspaceEntity(
			randomUUID(),
			args.title,
			args.logoId,
			args.creatorId,
			now().toJSDate(),
			now().toJSDate(),
			null,
		);
	}
}
