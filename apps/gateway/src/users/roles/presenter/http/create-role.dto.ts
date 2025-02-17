import { Permission } from '@repo/types';
import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
	@IsNotEmpty()
	@IsString()
	readonly title!: string;

	@IsNotEmpty()
	@IsArray()
	@IsIn([...Object.values(Permissions)], { each: true })
	readonly permissions!: Permission[];
}
