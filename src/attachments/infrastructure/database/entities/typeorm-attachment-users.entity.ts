import { Entity, PrimaryColumn } from 'typeorm';
import { UserId } from '../../../../../common/types';
import { AttachmentId } from '../../../../../attachments/domain/entities/attachment-users.entity';
import { AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';

@Entity({ name: 'attachment_users' })
export class TypeormAttachmentUserEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'attachment_id',
    primaryKeyConstraintName: 'PK_ATTACHMENT_USERS_ID',
  })
  attachmentId!: AttachmentId;

  @PrimaryColumn({
    type: 'uuid',
    name: 'user_id',
    primaryKeyConstraintName: 'PK_ATTACHMENT_USERS_ID',
  })
  userId!: UserId;

  static toAttachmentUserEntity(item: TypeormAttachmentUserEntity): AttachmentUserEntity {
    return new AttachmentUserEntity(item.attachmentId, item.userId);
  }
}
