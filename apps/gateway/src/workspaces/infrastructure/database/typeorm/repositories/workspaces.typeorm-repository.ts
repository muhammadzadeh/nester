import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, PaginationOption } from '@repo/types';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WorkspaceEntity } from '../../../../domain/entities/workspace.entity';
import {
  FindWorkspaceOptions,
  WorkspaceOrderBy,
  WorkspacesRepository,
} from '../../../../domain/repositories/workspaces.repository';
import { WorkspaceTypeormEntity } from '../entities/workspace.typeorm-entity';
import { WorkspaceTypeormMapper } from '../mappers/workspace.typeorm-mapper';

@Injectable()
export class WorkspacesTypeormRepository implements WorkspacesRepository {
	constructor(
		@InjectRepository(WorkspaceTypeormEntity)
		private readonly repository: Repository<WorkspaceTypeormEntity>,
	) {}

	async exists(options: Partial<FindWorkspaceOptions>): Promise<boolean> {
		const queryBuilder = this.buildSelectQuery(options, 'workspace');
		return queryBuilder.getExists();
	}

	async save(data: WorkspaceEntity): Promise<WorkspaceEntity> {
		const item = await this.repository.save(WorkspaceTypeormMapper.toPersist(data));
		return WorkspaceTypeormMapper.toDomain(item);
	}

	async findOne(options: Partial<FindWorkspaceOptions>): Promise<WorkspaceEntity | null> {
		const queryBuilder = this.buildSelectQuery(options);
		const item = await queryBuilder.getOne();
		return item ? WorkspaceTypeormMapper.toDomain(item) : null;
	}

	async findAll(
		options: Partial<FindWorkspaceOptions>,
		pagination?: PaginationOption<WorkspaceOrderBy>,
	): Promise<Paginated<WorkspaceEntity>> {
		const queryBuilder = this.buildSelectQuery(options, 'workspace');

		if (pagination?.orderBy) {
			queryBuilder.addOrderBy(`workspace.${pagination.orderBy}`, pagination.orderDir);
		}

		if (pagination?.page) {
			queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
		}

		const result = await queryBuilder.getManyAndCount();

		return {
			items: result[0].map((item) => WorkspaceTypeormMapper.toDomain(item)),
			total: result[1],
		};
	}

	async update(options: Partial<FindWorkspaceOptions>, data: Partial<WorkspaceEntity>): Promise<void> {
		const queryBuilder = this.buildSelectQuery(options);
		await queryBuilder.update(WorkspaceTypeormEntity).set(data).execute();
	}

	private buildSelectQuery(
		options: Partial<FindWorkspaceOptions>,
		alias?: string,
	): SelectQueryBuilder<WorkspaceTypeormEntity> {
		const queryBuilder = this.repository.createQueryBuilder(alias);
		if (options.ids) {
			queryBuilder.andWhere(`${alias ? alias + '.' : ''}id IN (:...ids)`, { ids: options.ids });
		}
		return queryBuilder;
	}
}
