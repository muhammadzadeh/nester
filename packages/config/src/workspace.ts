import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WorkspaceConfig {
	@IsNotEmpty()
	@IsUUID('4')
	@Type(() => String)
	readonly defaultRoleId!: string;
}
