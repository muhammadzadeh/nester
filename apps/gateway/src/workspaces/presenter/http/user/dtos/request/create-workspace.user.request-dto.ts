import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkspaceUserRequestDto {
	@IsNotEmpty()
	@IsString()
	readonly title!: string;

	@IsOptional()
	@IsUUID('4')
	readonly logoId!: string | null;
}
