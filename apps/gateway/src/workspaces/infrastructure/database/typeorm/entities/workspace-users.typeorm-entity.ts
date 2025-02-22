import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { WorkspaceUserStatus } from '../../../../domain/enums/workspace-user-status.enum';

@Entity({
	name: 'workspace_users',
})
@Unique('workspace_users_token_u', ['token'])
export class WorkspaceUserTypeormEntity {
	@PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'workspace_users_id_pkey' })
	readonly id!: string;

	@Column({ type: 'uuid', name: 'user_id', nullable: true })
	readonly userId!: string | null;

	@Column({ type: 'uuid', name: 'invited_by_user_id' })
	readonly invitedByUserId!: string;

	@Column({ type: 'uuid', name: 'workspace_id' })
	readonly workspaceId!: string;

	@Column({ type: 'uuid', name: 'role_id' })
	readonly roleId!: string;

	@Column({ type: 'varchar', name: 'email', nullable: true })
	readonly email!: string | null;

	@Column({ type: 'varchar', name: 'mobile', nullable: true })
	readonly mobile!: string | null;

	@Column({ type: 'varchar', name: 'token' })
	readonly token!: string;

	@Column({ type: 'enum', enumName: 'WorkspaceUserStatus', enum: WorkspaceUserStatus })
	readonly status!: WorkspaceUserStatus;

	@Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly createdAt!: Date;

	@Column({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly updatedAt!: Date;

	@Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
	readonly deletedAt!: Date | null;

	@Column({ type: 'timestamptz', nullable: true, name: 'responded_at' })
	readonly respondedAt!: Date | null;
}
