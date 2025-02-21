import { ApiProperty } from '@nestjs/swagger';
import { ListResponse, Paginated } from '@repo/types';
import { Type } from 'class-transformer';
import { WorkspaceUserEntity } from '../../../../../domain/entities/workspace-user.entity';
import { FilterWorkspaceUserUserRequestDto } from '../request/filter-works-ace-user.user.request-dto';
import { WorkspaceUserUserResponseDto } from './workspace-user.user.response-dto';

export class WorkspaceUserListUserResponseDto extends ListResponse<WorkspaceUserUserResponseDto> {
	static from(
		data: Paginated<WorkspaceUserEntity>,
		filters: FilterWorkspaceUserUserRequestDto,
	): WorkspaceUserListUserResponseDto {
		return new WorkspaceUserListUserResponseDto(
			data.items.map((item) => WorkspaceUserUserResponseDto.from(item)),
			{
				total: data.total,
				page: filters.page,
				pageSize: filters.pageSize,
			},
		);
	}

	@ApiProperty({
		type: WorkspaceUserUserResponseDto,
		isArray: true,
		description: 'The Users',
	})
	@Type(() => WorkspaceUserUserResponseDto)
	declare items: WorkspaceUserUserResponseDto[];
}
