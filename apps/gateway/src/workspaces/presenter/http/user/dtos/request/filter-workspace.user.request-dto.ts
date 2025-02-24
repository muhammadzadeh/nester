import { PaginationDto } from '@package/types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceOrderBy } from '../../../../../domain/repositories/workspaces.repository';

export class FilterWorkspaceUserRequestDto extends PaginationDto {
	@IsNotEmpty()
	@IsEnum(WorkspaceOrderBy)
	readonly orderBy!: WorkspaceOrderBy;
}
