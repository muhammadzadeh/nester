import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AttachmentEntity, AttachmentVisibility, MimeType } from '../../../domain/entities/attachments.entity';
import { UserId } from '../../../../common/types';
import { AttachmentId } from '../../../domain/entities/attachment-users.entity';

@Entity({ name: 'attachments' })
export class TypeormAttachmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: AttachmentId;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'varchar', nullable: true, name: 'title' })
  title!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'name' })
  name!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'original_name' })
  originalName!: string | null;

  @Column({ type: 'enum', enum: AttachmentVisibility, name: 'visibility' })
  visibility!: AttachmentVisibility;

  @Column({ type: 'jsonb', nullable: true, name: 'mime_type' })
  mimeType!: MimeType | null;

  @Column({ type: 'int', name: 'size' })
  size!: number;

  @Column({ type: 'varchar', name: 'uploader_id' })
  uploaderId!: UserId;

  static toAttachmentEntity(item: TypeormAttachmentEntity): AttachmentEntity {
    return new AttachmentEntity(
      item.title,
      item.name,
      item.originalName,
      item.size,
      item.visibility,
      item.mimeType,
      item.uploaderId,
      item.id,
      item.deletedAt,
      item.createdAt,
      item.updatedAt,
    );
  }
}
