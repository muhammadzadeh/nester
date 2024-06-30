import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Permission, RoleEntity } from '../../../domain/entities/role.entity';

@Entity({
  name: 'roles',
})
export class TypeormRoleEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'roles_id_pkey' })
  readonly id!: string;

  @Column({ type: 'varchar', name: 'title' })
  readonly title!: string;

  @Column({ type: 'varchar', name: 'permissions', default: [], array: true })
  readonly permissions!: Permission[];

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @Column({ type: 'boolean', name: 'is_system_role' })
  readonly isSystemRole!: boolean;

  static toRoleEntity(item: TypeormRoleEntity): RoleEntity {
    return new RoleEntity(
      item.title,
      item.permissions,
      item.id,
      item.createdAt,
      item.updatedAt,
      item.deletedAt,
      item.isSystemRole,
    );
  }
}
