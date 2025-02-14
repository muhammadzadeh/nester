import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'workspace_users',
})
export class WorkspaceUserTypeormEntity {
	@PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'workspace_users_id_pkey' })
	readonly id!: string;

	@Column({ type: 'uuid', name: 'user_id' })
	readonly userId!: string;

	@Column({ type: 'uuid', name: 'workspace_id' })
	readonly workspaceId!: string;

	@Column({ type: 'uuid', name: 'role_id' })
	readonly roleId!: string;

	@Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly createdAt!: Date;

	@Column({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly updatedAt!: Date;

	@Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
	readonly deletedAt!: Date | null;

}
