import { Injectable } from '@nestjs/common';
import { Paginated } from '@package/types';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../users/roles/application/roles.service';
import { RoleEntity } from '../../../../users/roles/domain/entities/role.entity';
import { WorkspaceUserEntity } from '../../../domain/entities/workspace-user.entity';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { FindWorkspaceUsersQuery } from './find-workspace-users.query';

@Injectable()
export class FindWorkspaceUsersUsecase {
	constructor(
		private readonly workspaceUsersRepository: WorkspaceUsersRepository,
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly rolesService: RolesService,
		private readonly usersService: UsersService,
	) {}

	async execute(query: FindWorkspaceUsersQuery): Promise<Paginated<WorkspaceUserEntity>> {
		const { items, total } = await this.workspaceUsersRepository.findAll(query.conditions, query.pagination);

		const workspaceIds: string[] = [];
		const userIds: string[] = [];
		const roleIds: string[] = [];

		items.forEach((item) => {
			if (!workspaceIds.includes(item.workspaceId)) workspaceIds.push(item.workspaceId);
			if (!roleIds.includes(item.roleId)) roleIds.push(item.roleId);
			if (item.userId && !userIds.includes(item.userId)) userIds.push(item.userId);
		});

		const [workspaces, users, roles] = await Promise.all([
			this.findWorkspaces(workspaceIds),
			this.findUsers(userIds),
			this.findRoles(roleIds),
		]);

		for (const item of items) {
			item.workspace = workspaces.find((workspace) => workspace.id === item.workspaceId);
			item.user = users.find((user) => user.id === item.userId);
			item.role = roles.find((role) => role.id === item.roleId);
		}

		return {
			items,
			total,
		};
	}

	private async findWorkspaces(ids: string[]): Promise<WorkspaceEntity[]> {
		if (!ids.length) {
			return [];
		}

		const { items } = await this.workspacesRepository.findAll({
			ids,
		});
		return items;
	}

	private async findUsers(ids: string[]): Promise<UserEntity[]> {
		if (!ids.length) {
			return [];
		}

		const { items } = await this.usersService.findAll({
			ids,
		});
		return items;
	}

	private async findRoles(ids: string[]): Promise<RoleEntity[]> {
		if (!ids.length) {
			return [];
		}

		const { items } = await this.rolesService.findAll({
			ids,
		});
		return items;
	}
}
