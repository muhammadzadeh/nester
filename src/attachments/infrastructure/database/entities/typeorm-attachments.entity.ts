import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserId } from '../../../../common/types';
import { AttachmentId } from '../../../domain/entities/attachment-users.entity';
import { AttachmentEntity, AttachmentVisibility, MimeType } from '../../../domain/entities/attachments.entity';

@Entity({ name: 'attachments' })
export class TypeormAttachmentEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'attachments_id_pkey' })
  id!: AttachmentId;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'varchar', name: 'path' })
  path!: string;

  @Column({ type: 'varchar', name: 'name' })
  name!: string;

  @Column({ type: 'varchar', nullable: true, name: 'original_name' })
  originalName!: string | null;

  @Column({ type: 'enum', enum: AttachmentVisibility, name: 'visibility' })
  visibility!: AttachmentVisibility;

  @Column({ type: 'jsonb', nullable: true, name: 'mime_type' })
  mimeType!: MimeType | null;

  @Column({ type: 'int', name: 'size' })
  size!: number;

  @Column({ type: 'uuid', name: 'uploader_id' })
  @Index('attachments_uploader_id_idx')
  uploaderId!: UserId;

  @Column({ type: 'boolean', name: 'is_draft' })
  isDraft!: boolean;

  @Column({ type: 'boolean', name: 'is_shared' })
  isShared!: boolean;

  @Column({ type: 'varchar', nullable: true, name: 'share_token' })
  @Index('attachments_uploader_share_token_idx')
  shareToken!: string | null;

  static toAttachmentEntity(item: TypeormAttachmentEntity): AttachmentEntity {
    return new AttachmentEntity(
      item.originalName,
      item.size,
      item.visibility,
      item.mimeType,
      item.uploaderId,
      item.isDraft,
      item.path,
      item.name,
      item.isShared,
      item.shareToken,
      item.id,
      item.deletedAt,
      item.createdAt,
      item.updatedAt,
    );
  }
}
