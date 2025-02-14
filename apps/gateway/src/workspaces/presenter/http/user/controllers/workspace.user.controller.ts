import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserController } from '@repo/decorator';
import { CurrentUser } from '../../../../../authentication/presenter/http/decorators';
import { WorkspacesService } from '../../../../application/workspaces.service';
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
		@CurrentUser() user: CurrentUser,
		@Body() data: CreateWorkspaceUserRequestDto,
	): Promise<WorkspaceUserResponseDto> {
		const createdWorkspace = await this.workspacesService.create({ ...data, userId: user.id });
		return WorkspaceUserResponseDto.from(createdWorkspace);
	}
}
