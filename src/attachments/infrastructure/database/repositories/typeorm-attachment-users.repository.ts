import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';
import { AttachmentUsersRepository } from '../../../domain/repositories/attachment-users.repository';
import { TypeormAttachmentUserEntity } from '../entities';

@Injectable()
export class TypeormAttachmentUsersRepository implements AttachmentUsersRepository {
  constructor(
    @InjectRepository(TypeormAttachmentUserEntity)
    private readonly repository: Repository<TypeormAttachmentUserEntity>,
  ) {}

  async save(input: AttachmentUserEntity): Promise<void> {
    await this.repository.upsert(input, {
      conflictPaths: { attachmentId: true, userId: true },
    });
  }

  async exists(input: Partial<AttachmentUserEntity>): Promise<boolean> {
    return await this.repository.exists({
      where: input,
    });
  }

  async delete(options: Partial<AttachmentUserEntity>): Promise<void> {
    await this.repository.delete(options);
  }
}
