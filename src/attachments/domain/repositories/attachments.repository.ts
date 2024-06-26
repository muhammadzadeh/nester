import { Pagination } from '../../../../common/database';
import { AttachmentEntity } from '../entities/attachments.entity';

export interface FindAttachmentOptions {
  ids?: string[];
  shareTokens?: string[];
}

export const ATTACHMENTS_REPOSITORY_TOKEN = Symbol('AttachmentsRepository');

export interface AttachmentsRepository {
  save(data: AttachmentEntity): Promise<AttachmentEntity>;
  findOne(options: FindAttachmentOptions): Promise<AttachmentEntity | null>;
  findAll(options: FindAttachmentOptions): Promise<Pagination<AttachmentEntity>>;
  exists(options: FindAttachmentOptions): Promise<boolean>;
  delete(options: FindAttachmentOptions): Promise<void>;
  update(options: FindAttachmentOptions, data: Partial<AttachmentEntity>): Promise<void>;
}
