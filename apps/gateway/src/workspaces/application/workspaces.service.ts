import { Injectable } from '@nestjs/common';
import { Paginated } from '@repo/types';
import { WorkspaceUserEntity } from '../domain/entities/workspace-user.entity';
import { WorkspaceEntity } from '../domain/entities/workspace.entity';
import { AddUserToWorkspaceCommand } from './usecases/add-user-to-workspace/add-user-to-workspace.command';
import { AddUserToWorkspaceUsecase } from './usecases/add-user-to-workspace/add-user-to-workspace.usecase';
import { CreateWorkspaceCommand } from './usecases/create-workspace/create-workspace.command';
import { CreateWorkspaceUsecase } from './usecases/create-workspace/create-workspace.usecase';
import { FindWorkspaceUsersQuery } from './usecases/find-workspace-users/find-workspace-users.query';
import { FindWorkspaceUsersUsecase } from './usecases/find-workspace-users/find-workspace-users.usecase';

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly findWorkspaceUsers: FindWorkspaceUsersUsecase,
		private readonly addWorkspaceUser: AddUserToWorkspaceUsecase,
		private readonly createWorkspace: CreateWorkspaceUsecase,
	) {}

	async create(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
		return this.createWorkspace.execute(command);
	}

	async addUser(command: AddUserToWorkspaceCommand): Promise<void> {
		await this.addWorkspaceUser.execute(command);
	}

	async findUsers(command: FindWorkspaceUsersQuery): Promise<Paginated<WorkspaceUserEntity>> {
		return await this.findWorkspaceUsers.execute(command);
	}
}
