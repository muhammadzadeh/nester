import { ApiProperty } from '@nestjs/swagger';
import { Email, Mobile } from '@repo/types';
import { Type } from 'class-transformer';
import { RoleResponse } from '../../../../../../users/roles/presenter/http/role.response';
import { WorkspaceUserEntity } from '../../../../../domain/entities/workspace-user.entity';
import { WorkspaceUserStatus } from '../../../../../domain/enums/workspace-user-status.enum';

class WorkspaceUserResponse {
	static from(data: { mobile: string | null; email: string | null }): WorkspaceUserResponse {
		return {
			email: data.email,
			mobile: data.mobile,
		};
	}

	@ApiProperty({
		type: String,
		nullable: true,
	})
	@Type(() => String)
	readonly email!: Email | null;

	@ApiProperty({
		type: String,
		nullable: true,
	})
	@Type(() => String)
	readonly mobile!: Mobile | null;
}

export class WorkspaceUserUserResponseDto {
	static from(item: WorkspaceUserEntity): WorkspaceUserUserResponseDto {
		return {
			id: item.id,
			createdAt: item.createdAt,
			respondedAt: item.respondedAt,
			status: item.status,
			role: item.role ? RoleResponse.from(item.role) : null,
			user: item.user
				? WorkspaceUserResponse.from(item.user)
				: WorkspaceUserResponse.from({
						email: item.email,
						mobile: item.mobile,
					}),
		};
	}

	@ApiProperty({
		type: String,
		description: 'The ID',
		example: 'a1b2c3d4e54as4df4',
	})
	@Type(() => String)
	readonly id!: string;

	@ApiProperty({
		type: Date,
		description: 'The creation date',
	})
	@Type(() => Date)
	readonly createdAt!: Date;

	@ApiProperty({
		type: Date,
		description: 'The reposed date',
		nullable: true,
	})
	@Type(() => Date)
	readonly respondedAt!: Date | null;

	@ApiProperty({
		type: WorkspaceUserStatus,
		enum: WorkspaceUserStatus,
		enumName: 'WorkspaceUserStatus',
		description: 'The status',
	})
	@Type(() => String)
	readonly status!: WorkspaceUserStatus;

	@ApiProperty({
		type: RoleResponse,
		description: 'The role',
		nullable: true,
	})
	@Type(() => RoleResponse)
	readonly role!: RoleResponse | null;

	@ApiProperty({
		type: WorkspaceUserResponse,
		description: 'The user',
	})
	@Type(() => WorkspaceUserResponse)
	readonly user!: WorkspaceUserResponse;
}
