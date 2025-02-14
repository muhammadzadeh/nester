import { WorkspaceEntity } from '../../../../domain/entities/workspace.entity';
import { WorkspaceReadFactory } from '../../../../domain/factories/workspace.factory';
import { WorkspaceTypeormEntity } from '../entities/workspace.typeorm-entity';

export class WorkspaceMapper {
	static toDomain(args: WorkspaceTypeormEntity): WorkspaceEntity {
		return WorkspaceReadFactory.create({
			id: args.id,
			creatorId: args.creatorId,
			title: args.title,
			logoId: args.logoId,
			createdAt: args.createdAt,
			updatedAt: args.updatedAt,
			deletedAt: args.deletedAt,
		});
	}

	static toPersist(args: WorkspaceEntity): WorkspaceTypeormEntity {
		return {
			id: args.id,
			creatorId: args.creatorId,
			title: args.title,
			logoId: args.logoId,
			createdAt: args.createdAt,
			updatedAt: args.updatedAt,
			deletedAt: args.deletedAt,
		};
	}
}
