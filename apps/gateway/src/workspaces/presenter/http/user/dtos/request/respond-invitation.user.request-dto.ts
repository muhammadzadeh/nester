import { IsEnum, IsNotEmpty, IsNotIn, IsString, Length } from 'class-validator';
import { WorkspaceUserStatus } from '../../../../../domain/enums/workspace-user-status.enum';

export class RespondInvitationUserRequestDto {
	@IsNotEmpty()
	@IsString()
	@Length(10, 200)
	readonly token!: string;

	@IsNotEmpty()
	@IsEnum(WorkspaceUserStatus)
	@IsNotIn([WorkspaceUserStatus.PENDING])
	readonly status!: WorkspaceUserStatus;
}
