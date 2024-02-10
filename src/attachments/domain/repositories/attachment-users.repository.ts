import { UserId } from '../../../common/types';
import { AttachmentId, AttachmentUserEntity } from '../entities/attachment-users.entity';

export interface FindAttachmentUserData {
  userId: UserId;
  attachmentId: AttachmentId;
}

export const ATTACHMENT_USERS_REPOSITORY_TOKEN = Symbol('AttachmentUsersRepository');

export interface AttachmentUsersRepository {
  save(input: AttachmentUserEntity): Promise<void>;
  exists(input: Partial<FindAttachmentUserData>): Promise<boolean>;
  delete(input: Partial<FindAttachmentUserData>): Promise<void>;
}
