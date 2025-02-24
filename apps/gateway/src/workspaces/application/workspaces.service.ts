import { Injectable } from '@nestjs/common';
import { Paginated } from '@package/types';
import { WorkspaceUserEntity } from '../domain/entities/workspace-user.entity';
import { WorkspaceEntity } from '../domain/entities/workspace.entity';
import { AddUserToWorkspaceCommand } from './usecases/add-user-to-workspace/add-user-to-workspace.command';
import { AddUserToWorkspaceUsecase } from './usecases/add-user-to-workspace/add-user-to-workspace.usecase';
import { CreateWorkspaceCommand } from './usecases/create-workspace/create-workspace.command';
import { CreateWorkspaceUsecase } from './usecases/create-workspace/create-workspace.usecase';
import { FindWorkspaceUsersQuery } from './usecases/find-workspace-users/find-workspace-users.query';
import { FindWorkspaceUsersUsecase } from './usecases/find-workspace-users/find-workspace-users.usecase';
import { FindWorkspacesQuery } from './usecases/find-workspaces/find-workspaces.query';
import { FindWorkspacesUsecase } from './usecases/find-workspaces/find-workspaces.usecase';
import { RespondInvitationCommand } from './usecases/respond-invitation/respond-invitation.command';
import { RespondInvitationUsecase } from './usecases/respond-invitation/respond-invitation.usecase';
import { RemoveWorkspaceUserCommand } from './usecases/remove-user-from-workspace/remove-user.command';
import { RemoveWorkspaceUserUsecase } from './usecases/remove-user-from-workspace/remove-user.usecase';
import { LeftFromWorkspaceUsecase } from './usecases/left-from-workspace/left-from-workspace.usecase';
import { LeftFromWorkspaceCommand } from './usecases/left-from-workspace/left-from-workspace.command';

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly leftWorkspaceUsecase: LeftFromWorkspaceUsecase,
		private readonly findWorkspaceUsers: FindWorkspaceUsersUsecase,
		private readonly removeUserUsecase: RemoveWorkspaceUserUsecase,
		private readonly findWorkspacesUsecase: FindWorkspacesUsecase,
		private readonly addWorkspaceUser: AddUserToWorkspaceUsecase,
		private readonly respondUsecase: RespondInvitationUsecase,
		private readonly createWorkspace: CreateWorkspaceUsecase,
	) {}

	async create(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
		return this.createWorkspace.execute(command);
	}

	async addUser(command: AddUserToWorkspaceCommand): Promise<void> {
		await this.addWorkspaceUser.execute(command);
	}

	async respondInvitation(command: RespondInvitationCommand): Promise<void> {
		await this.respondUsecase.execute(command);
	}

	async removeUser(command: RemoveWorkspaceUserCommand): Promise<void> {
		await this.removeUserUsecase.execute(command);
	}

	async leftWorkspace(command: LeftFromWorkspaceCommand): Promise<void> {
		await this.leftWorkspaceUsecase.execute(command);
	}

	async findUsers(command: FindWorkspaceUsersQuery): Promise<Paginated<WorkspaceUserEntity>> {
		return await this.findWorkspaceUsers.execute(command);
	}

	async findWorkspaces(command: FindWorkspacesQuery): Promise<Paginated<WorkspaceEntity>> {
		return await this.findWorkspacesUsecase.execute(command);
	}
}
