import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
	CurrentUser,
	CurrentWorkspace,
	RequiredWorkspacePermissions,
	User,
	Workspace,
	WorkspacePermission,
} from '@repo/authentication';
import { UserController } from '@repo/decorator';
import { DoneResponse } from '@repo/types';
import { WorkspacesService } from '../../../../application/workspaces.service';
import { AddUserToWorkspaceUserRequestDto } from '../dtos/request/add-user-to-workspace.user.request-dto';
import { CreateWorkspaceUserRequestDto } from '../dtos/request/create-workspace.user.request-dto';
import { FilterWorkspaceUserUserRequestDto } from '../dtos/request/filter-works-ace-user.user.request-dto';
import { RespondInvitationUserRequestDto } from '../dtos/request/respond-invitation.user.request-dto';
import { WorkspaceUserListUserResponseDto } from '../dtos/response/workspace-user-list.user.response-dto';
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

	@Post('users')
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

	@Get('users')
	@ApiOkResponse({
		status: 200,
		type: WorkspaceUserListUserResponseDto,
	})
	@RequiredWorkspacePermissions(WorkspacePermission.READ_USERS)
	async fndUsers(
		@Workspace() workspace: CurrentWorkspace,
		@Query() filters: FilterWorkspaceUserUserRequestDto,
	): Promise<WorkspaceUserListUserResponseDto> {
		const result = await this.workspacesService.findUsers({
			conditions: {
				workspaceIds: [workspace.id],
			},
			pagination: {
				page: filters.page,
				pageSize: filters.pageSize,
				orderBy: filters.orderBy,
				orderDir: filters.orderDir,
			},
		});
		return WorkspaceUserListUserResponseDto.from(result, filters);
	}

	@Post('invitations')
	@ApiOkResponse({
		status: 200,
		type: DoneResponse,
	})
	async respondInvitation(
		@User() user: CurrentUser,
		@Body() data: RespondInvitationUserRequestDto,
	): Promise<DoneResponse> {
		await this.workspacesService.respondInvitation({
			...data,
			userId: user.id,
		});
		return new DoneResponse();
	}
}
