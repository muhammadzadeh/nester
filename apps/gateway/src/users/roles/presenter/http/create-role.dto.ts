import { Permission, WorkspacePermission } from '@repo/authentication';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
	@IsNotEmpty()
	@IsString()
	readonly title!: string;

	@IsNotEmpty()
	@IsArray()
	@IsEnum(WorkspacePermission, { each: true })
	readonly permissions!: Permission[];
}
