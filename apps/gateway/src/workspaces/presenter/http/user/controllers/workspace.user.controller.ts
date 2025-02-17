import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentWorkspace, RequiredWorkspacePermissions, User, Workspace } from '@repo/authentication';
import { UserController } from '@repo/decorator';
import { DoneResponse, WorkspacePermission } from '@repo/types';
import { WorkspacesService } from '../../../../application/workspaces.service';
import { AddUserToWorkspaceUserRequestDto } from '../dtos/request/add-user-to-workspace.user.request-dto';
import { CreateWorkspaceUserRequestDto } from '../dtos/request/create-workspace.user.request-dto';
import { WorkspaceUserResponseDto } from '../dtos/response/workspace.user.response-dto';

@ApiTags('Workspace')
@UserController(`/workspaces`)
export class WorkspaceUserController {
	constructor(private readonly workspacesService: WorkspacesService) {}

	@Post()
	@ApiOkResponse({
		status: 200,
		type: WorkspaceUserResponseDto,
	})
	async createWorkspace(
		@User() user: CurrentUser,
		@Body() data: CreateWorkspaceUserRequestDto,
	): Promise<WorkspaceUserResponseDto> {
		const createdWorkspace = await this.workspacesService.create({ ...data, userId: user.id });
		return WorkspaceUserResponseDto.from(createdWorkspace);
	}

	@Post()
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	@RequiredWorkspacePermissions(WorkspacePermission.WRITE_USERS)
	async addUser(
		@User() user: CurrentUser,
		@Workspace() workspace: CurrentWorkspace,
		@Body() data: AddUserToWorkspaceUserRequestDto,
	): Promise<DoneResponse> {
		await this.workspacesService.addUser({ ...data, userId: user.id, workspaceId: workspace.id });
		return new DoneResponse();
	}
}
