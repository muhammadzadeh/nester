import { Injectable } from '@nestjs/common';
import { WorkspaceEntity } from '../domain/entities/workspace.entity';
import { AddUserToWorkspaceCommand } from './usecases/add-user-to-workspace/add-user-to-workspace.command';
import { AddUserToWorkspaceUsecase } from './usecases/add-user-to-workspace/add-user-to-workspace.usecase';
import { CreateWorkspaceCommand } from './usecases/create-workspace/create-workspace.command';
import { CreateWorkspaceUsecase } from './usecases/create-workspace/create-workspace.usecase';

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly addWorkspaceUser: AddUserToWorkspaceUsecase,
		private readonly createWorkspace: CreateWorkspaceUsecase,
	) {}

	async create(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
		return this.createWorkspace.execute(command);
	}

	async addUser(command: AddUserToWorkspaceCommand): Promise<void> {
		await this.addWorkspaceUser.execute(command);
	}
}
