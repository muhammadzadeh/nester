import { Pagination } from '../../../common/database';
import { AttachmentId } from '../entities/attachment-users.entity';
import { AttachmentEntity } from '../entities/attachments.entity';

export interface FindAttachmentData {
  ids: AttachmentId[];
}

export const ATTACHMENTS_REPOSITORY_TOKEN = Symbol('AttachmentsRepository');

export interface AttachmentsRepository {
  save(input: AttachmentEntity): Promise<AttachmentEntity>;
  findOne(input: Partial<FindAttachmentData>): Promise<AttachmentEntity | null>;
  findAll(input: Partial<FindAttachmentData>): Promise<Pagination<AttachmentEntity>>;
  exists(input: Partial<FindAttachmentData>): Promise<boolean>;
  delete(input: Partial<FindAttachmentData>): Promise<void>;
}
