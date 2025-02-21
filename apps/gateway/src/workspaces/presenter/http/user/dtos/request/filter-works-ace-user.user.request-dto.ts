import { PaginationDto } from '@repo/types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceUserOrderBy } from '../../../../../domain/repositories/workspace-users.repository';

export class FilterWorkspaceUserUserRequestDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(WorkspaceUserOrderBy)
	readonly orderBy!: WorkspaceUserOrderBy;
}
