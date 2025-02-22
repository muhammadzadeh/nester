import { ApiProperty } from '@nestjs/swagger';
import { ListResponse, Paginated } from '@repo/types';
import { Type } from 'class-transformer';
import { WorkspaceEntity } from '../../../../../domain/entities/workspace.entity';
import { FilterWorkspaceUserRequestDto } from '../request/filter-workspace.user.request-dto';
import { WorkspaceUserResponseDto } from './workspace.user.response-dto';

export class WorkspaceListUserResponseDto extends ListResponse<WorkspaceUserResponseDto> {
	static from(data: Paginated<WorkspaceEntity>, filters: FilterWorkspaceUserRequestDto): WorkspaceListUserResponseDto {
		return new WorkspaceListUserResponseDto(
			data.items.map((item) => WorkspaceUserResponseDto.from(item)),
			{
				total: data.total,
				page: filters.page,
				pageSize: filters.pageSize,
			},
		);
	}

	@ApiProperty({
		type: WorkspaceUserResponseDto,
		isArray: true,
		description: 'The workspaces',
	})
	@Type(() => WorkspaceUserResponseDto)
	declare items: WorkspaceUserResponseDto[];
}
