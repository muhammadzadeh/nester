import { IsEmail, IsMobilePhone, IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';

export class AddUserToWorkspaceUserRequestDto {
	@ValidateIf(({ email }) => !email)
	@IsNotEmpty()
	@IsMobilePhone()
	readonly mobile!: string | null;

	@ValidateIf(({ mobile }) => !mobile)
	@IsNotEmpty()
	@IsEmail()
	readonly email!: string | null;

	@IsNotEmpty()
	@IsUUID('4')
	readonly roleId!: string;
}
