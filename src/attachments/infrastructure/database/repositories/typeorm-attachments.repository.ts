import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AttachmentEntity } from '../../../domain/entities/attachments.entity';
import { AttachmentsRepository, FindAttachmentOptions } from '../../../domain/repositories/attachments.repository';
import { TypeormAttachmentEntity } from '../entities';
import { Pagination } from '../../../../../common/database';

@Injectable()
export class TypeormAttachmentsRepository implements AttachmentsRepository {
  constructor(
    @InjectRepository(TypeormAttachmentEntity)
    private readonly repository: Repository<TypeormAttachmentEntity>,
  ) {}

  async findAll(options: FindAttachmentOptions): Promise<Pagination<AttachmentEntity>> {
    const queryBuilder = this.buildQuery(options);

    const [items, count] = await queryBuilder.getManyAndCount();
    return {
      total: count,
      items: items.map((item) => TypeormAttachmentEntity.toAttachmentEntity(item)),
    };
  }

  async save(data: AttachmentEntity): Promise<AttachmentEntity> {
    const item = await this.repository.save(data);
    return TypeormAttachmentEntity.toAttachmentEntity(item);
  }

  async findOne(options: FindAttachmentOptions): Promise<AttachmentEntity | null> {
    const queryBuilder = this.buildQuery(options);

    const item = await queryBuilder.getOne();
    return item ? TypeormAttachmentEntity.toAttachmentEntity(item) : null;
  }

  async exists(options: FindAttachmentOptions): Promise<boolean> {
    const queryBuilder = this.buildQuery(options);
    return await queryBuilder.getExists();
  }

  async delete(options: FindAttachmentOptions): Promise<void> {
    const queryBuilder = this.buildQuery(options);
    await queryBuilder.softDelete().execute();
  }

  private buildQuery(options: FindAttachmentOptions): SelectQueryBuilder<TypeormAttachmentEntity> {
    const queryBuilder = this.repository.createQueryBuilder('attachment');

    if (options.ids) {
      queryBuilder.andWhere(`attachment.id IN(:...ids)`, { ids: options.ids });
    }

    return queryBuilder;
  }
}
