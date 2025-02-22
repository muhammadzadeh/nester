import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'workspaces',
})
export class WorkspaceTypeormEntity {
	@PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'workspaces_id_pkey' })
	readonly id!: string;

	@Column({ type: 'varchar', name: 'title' })
	readonly title!: string;

	@Column({ type: 'uuid', name: 'creator_id' })
	readonly creatorId!: string;

	@Column({ type: 'uuid', name: 'logo_id', nullable: true })
	readonly logoId!: string | null;

	@Column({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly createdAt!: Date;

	@Column({ type: 'timestamptz', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
	readonly updatedAt!: Date;

	@Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
	readonly deletedAt!: Date | null;
}
