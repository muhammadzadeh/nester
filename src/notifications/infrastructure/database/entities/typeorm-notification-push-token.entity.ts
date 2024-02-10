import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { NotificationPushTokenEntity, PushProvider } from '../../../domain/entities/notification-push-token.entity';

@Entity({ name: 'notification_push_tokens' })
export class TypeormNotificationPushTokenEntity {
  @PrimaryGeneratedColumn('uuid', {primaryKeyConstraintName: 'PK_NOTIFICATION_PUSH_TOKENS_ID'})
  id!: string;

  @Column({ type: 'varchar', name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar'})
  token!: string;

  @Column({ type: 'enum', enum: PushProvider, default: PushProvider.FCM })
  provider!: PushProvider;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  static toNotificationPushTokenEntity(input: TypeormNotificationPushTokenEntity): NotificationPushTokenEntity {
    return new NotificationPushTokenEntity(
      input.userId,
      input.token,
      input.provider,
      input.id,
      input.deletedAt,
      input.createdAt,
      input.updatedAt,
    );
  }
}
