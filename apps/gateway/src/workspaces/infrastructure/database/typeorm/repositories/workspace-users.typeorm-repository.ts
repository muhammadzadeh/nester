import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, PaginationOption } from '@repo/types';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WorkspaceUserEntity } from '../../../../domain/entities/workspace-user.entity';
import {
	FindWorkspaceUserOptions,
	WorkspaceUserOrderBy,
	WorkspaceUsersRepository,
} from '../../../../domain/repositories/workspace-users.repository';
import { WorkspaceUserTypeormEntity } from '../entities/workspace-users.typeorm-entity';
import { WorkspaceUserTypeormMapper } from '../mappers/workspace-user.typeorm-mapper';

@Injectable()
export class WorkspaceUsersTypeormRepository implements WorkspaceUsersRepository {
	constructor(
		@InjectRepository(WorkspaceUserTypeormEntity)
		private readonly repository: Repository<WorkspaceUserTypeormEntity>,
	) {}

	async exists(options: Partial<FindWorkspaceUserOptions>): Promise<boolean> {
		const queryBuilder = this.buildSelectQuery(options, 'workspace');
		return queryBuilder.getExists();
	}

	async save(data: WorkspaceUserEntity): Promise<WorkspaceUserEntity> {
		const item = await this.repository.save(WorkspaceUserTypeormMapper.toPersist(data));
		return WorkspaceUserTypeormMapper.toDomain(item);
	}

	async findOne(options: Partial<FindWorkspaceUserOptions>): Promise<WorkspaceUserEntity | null> {
		const queryBuilder = this.buildSelectQuery(options);
		const item = await queryBuilder.getOne();
		return item ? WorkspaceUserTypeormMapper.toDomain(item) : null;
	}

	async findAll(
		options: Partial<FindWorkspaceUserOptions>,
		pagination?: PaginationOption<WorkspaceUserOrderBy>,
	): Promise<Paginated<WorkspaceUserEntity>> {
		const queryBuilder = this.buildSelectQuery(options, 'workspace');

		if (pagination?.orderBy) {
			queryBuilder.addOrderBy(`workspace.${pagination.orderBy}`, pagination.orderDir);
		}

		if (pagination?.page) {
			queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
		}

		const result = await queryBuilder.getManyAndCount();

		return {
			items: result[0].map((item) => WorkspaceUserTypeormMapper.toDomain(item)),
			total: result[1],
		};
	}

	async update(options: Partial<FindWorkspaceUserOptions>, data: Partial<WorkspaceUserEntity>): Promise<void> {
		const queryBuilder = this.buildSelectQuery(options);
		await queryBuilder.update(WorkspaceUserTypeormEntity).set(data).execute();
	}

	private buildSelectQuery(
		options: Partial<FindWorkspaceUserOptions>,
		alias?: string,
	): SelectQueryBuilder<WorkspaceUserTypeormEntity> {
		const queryBuilder = this.repository.createQueryBuilder(alias);
		if (options.ids?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}id IN (:...ids)`, { ids: options.ids });
		}
		if (options.roleIds?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}role_id IN (:...roleIds)`, { roleIds: options.roleIds });
		}
		if (options.userIds?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}user_id IN (:...userIds)`, { userIds: options.userIds });
		}
		if (options.workspaceIds?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}workspace_id IN (:...workspaceIds)`, {
				workspaceIds: options.workspaceIds,
			});
		}
		if (options.emails?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}email IN (:...emails)`, {
				emails: options.emails,
			});
		}
		if (options.mobiles?.length) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}mobile IN (:...mobiles)`, {
				mobiles: options.mobiles,
			});
		}
		return queryBuilder;
	}
}
