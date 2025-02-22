import { Inject } from '@nestjs/common';
import { SystemPermission, WorkspacePermission } from '@repo/authentication';
import { BaseSeeder, DatabaseSeeder } from '@repo/types';
import { now } from '@repo/utils/time';
import { randomUUID } from 'crypto';
import { RoleEntity } from '../domain/entities/role.entity';
import { ROLES_REPOSITORY_TOKEN, RolesRepository } from '../domain/repositories/roles.repository';

const defaultRoles: RoleEntity[] = [
	{
		id: randomUUID(),
		title: 'Super Admin',
		permissions: [SystemPermission.MANAGE_EVERY_THINGS],
		isSystemRole: true,
		createdAt: now().toJSDate(),
		updatedAt: now().toJSDate(),
		deletedAt: null,
	},
	{
		id: randomUUID(),
		title: 'Workspace Creator',
		permissions: [WorkspacePermission.MANAGE_EVERY_THINGS],
		isSystemRole: false,
		createdAt: now().toJSDate(),
		updatedAt: now().toJSDate(),
		deletedAt: null,
	},
];

@DatabaseSeeder()
export class DefaultRolesSeeder extends BaseSeeder {
	static readonly description = 'This script will seed default roles into db.';

	constructor(@Inject(ROLES_REPOSITORY_TOKEN) private readonly rolesRepository: RolesRepository) {
		super();
	}

	async run(): Promise<void> {
		const isRoleExists = await this.rolesRepository.exists({});
		if (isRoleExists) {
			return;
		}

		defaultRoles.forEach((role) => this.rolesRepository.save(role));
	}
}
