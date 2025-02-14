import { Injectable } from '@nestjs/common';
import { WorkspaceEntity } from '../domain/entities/workspace.entity';
import { CreateWorkspaceCommand } from './usecases/create-workspace/create-workspace.command';
import { CreateWorkspaceUsecase } from './usecases/create-workspace/create-workspace.usecase';

@Injectable()
export class WorkspacesService {
	constructor(private readonly createWorkspace: CreateWorkspaceUsecase) {}

	async create(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
		return this.createWorkspace.execute(command);
	}
}
