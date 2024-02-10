import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AttachmentEntity } from '../../../domain/entities/attachments.entity';
import { AttachmentsRepository, FindAttachmentData } from '../../../domain/repositories/attachments.repository';
import { TypeormAttachmentEntity } from '../entities';
import { Pagination } from '../../../../common/database';

@Injectable()
export class TypeormAttachmentsRepository implements AttachmentsRepository {
  constructor(
    @InjectRepository(TypeormAttachmentEntity)
    private readonly repository: Repository<TypeormAttachmentEntity>,
  ) {}

  async findAll(input: Partial<FindAttachmentData>): Promise<Pagination<AttachmentEntity>> {
    const queryBuilder = this.buildQuery(input);

    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      total: count,
      items: items.map((item) => TypeormAttachmentEntity.toAttachmentEntity(item)),
    };
  }

  async save(input: AttachmentEntity): Promise<AttachmentEntity> {
    const item = await this.repository.save(input);
    return TypeormAttachmentEntity.toAttachmentEntity(item);
  }

  async findOne(input: Partial<FindAttachmentData>): Promise<AttachmentEntity | null> {
    const queryBuilder = this.buildQuery(input);

    const item = await queryBuilder.getOne();
    return item ? TypeormAttachmentEntity.toAttachmentEntity(item) : null;
  }

  async exists(input: Partial<FindAttachmentData>): Promise<boolean> {
    const queryBuilder = this.buildQuery(input);
    return await queryBuilder.getExists();
  }

  async delete(input: Partial<FindAttachmentData>): Promise<void> {
    const queryBuilder = this.buildQuery(input);
    await queryBuilder.softDelete().execute();
  }

  private buildQuery(input: Partial<FindAttachmentData>): SelectQueryBuilder<TypeormAttachmentEntity> {
    const queryBuilder = this.repository.createQueryBuilder('attachment');

    if (input.ids) {
      queryBuilder.andWhere(`attachment.id IN(:...ids)`, { ids: input.ids });
    }

    return queryBuilder;
  }
}
