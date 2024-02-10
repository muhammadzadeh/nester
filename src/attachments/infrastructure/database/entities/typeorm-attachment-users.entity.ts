import { Entity, PrimaryColumn } from 'typeorm';
import { AttachmentId, AttachmentUserEntity } from '../../../domain/entities/attachment-users.entity';
import { UserId } from '../../../../common/types';

@Entity({ name: 'attachment_users' })
export class TypeormAttachmentUserEntity {
  @PrimaryColumn({ type: 'varchar', name: 'attachment_id' })
  attachmentId!: AttachmentId;

  @PrimaryColumn({ type: 'varchar', name: 'user_id' })
  userId!: UserId;

  static toAttachmentUserEntity(item: TypeormAttachmentUserEntity): AttachmentUserEntity {
    return new AttachmentUserEntity(item.attachmentId, item.userId);
  }
}
