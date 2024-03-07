import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/browser';
import { Pagination, PaginationOption } from '../../../../common/database';
import { StateEntity } from '../../../domain/entities/state.entity';
import { FindStateOptions, StateOrderBy, StatesRepository } from '../../../domain/repositories/states.repository';
import { TypeormStateEntity } from '../entities/typeorm-state.entity';

@Injectable()
export class TypeormStatesRepository implements StatesRepository {
  constructor(
    @InjectRepository(TypeormStateEntity)
    private readonly repository: Repository<TypeormStateEntity>,
  ) {}

  async findAll(
    options: Partial<FindStateOptions>,
    pagination?: PaginationOption<StateOrderBy> | undefined,
  ): Promise<Pagination<StateEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'state');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`state.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormStateEntity.toStateEntity(item)),
      total: result[1],
    };
  }
  async exists(options: Partial<FindStateOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options);
    return queryBuilder.getExists();
  }

  private buildSelectQuery(options: Partial<FindStateOptions>, alias?: string): SelectQueryBuilder<TypeormStateEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);

    if (options.searchTerm) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}name ILIKE :name`, { name: `%${options.searchTerm}%` });
    }
    if (options.countryId) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}countryId = :countryId`, { countryId: options.countryId });
    }
    return queryBuilder;
  }
}
