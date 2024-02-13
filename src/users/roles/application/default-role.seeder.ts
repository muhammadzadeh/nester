import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BaseSeeder, DatabaseSeeder } from '../../../common/database';
import { Permission, RoleEntity } from '../domain/entities/role.entity';
import { ROLES_REPOSITORY_TOKEN, RolesRepository } from '../domain/repositories/roles.repository';

const defaultRoles: RoleEntity[] = [
  {
    id: randomUUID(),
    title: 'Super Admin',
    permissions: [Permission.MANAGE_EVERY_THINGS],
    isSystemRole: true,
    createdAt: new Date(),
    updatedAt: new Date(),
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
