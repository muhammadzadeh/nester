import { Entity, PrimaryColumn } from 'typeorm';
import { UserId } from '../../../../common/types';
import { AttachmentId, AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';

@Entity({ name: 'attachment_users' })
export class TypeormAttachmentUserEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'attachment_id',
    primaryKeyConstraintName: 'PK_ATTACHMENT_USERS_ID',
  })
  attachmentId!: AttachmentId;

  @PrimaryColumn({
    type: 'varchar',
    name: 'user_id',
    primaryKeyConstraintName: 'PK_ATTACHMENT_USERS_ID',
  })
  userId!: UserId;

  static toAttachmentUserEntity(item: TypeormAttachmentUserEntity): AttachmentUserEntity {
    return new AttachmentUserEntity(item.attachmentId, item.userId);
  }
}
