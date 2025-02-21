import { WorkspaceUserEntity } from '../../../../domain/entities/workspace-user.entity';
import { WorkspaceUserReadFactory } from '../../../../domain/factories/workspace-user.factory';
import { WorkspaceUserTypeormEntity } from '../entities/workspace-users.typeorm-entity';

export class WorkspaceUserTypeormMapper {
	static toDomain(args: WorkspaceUserTypeormEntity): WorkspaceUserEntity {
		return WorkspaceUserReadFactory.create({
			id: args.id,
			userId: args.userId,
			invitedByUserId: args.invitedByUserId,
			mobile: args.mobile,
			email: args.email,
			status: args.status,
			token: args.token,
			workspaceId: args.workspaceId,
			roleId: args.roleId,
			createdAt: args.createdAt,
			updatedAt: args.updatedAt,
			deletedAt: args.deletedAt,
			acceptedAt: args.acceptedAt,
		});
	}

	static toPersist(args: WorkspaceUserEntity): WorkspaceUserTypeormEntity {
		return {
			id: args.id,
			userId: args.userId,
			invitedByUserId: args.invitedByUserId,
			mobile: args.mobile,
			email: args.email,
			status: args.status,
			token: args.token,
			workspaceId: args.workspaceId,
			roleId: args.roleId,
			createdAt: args.createdAt,
			updatedAt: args.updatedAt,
			deletedAt: args.deletedAt,
			acceptedAt: args.acceptedAt,
		};
	}
}
