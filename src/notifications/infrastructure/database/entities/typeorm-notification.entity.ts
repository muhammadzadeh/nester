import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {
  AlertStatus,
  EmailNotificationPayload,
  NotificationCenterData,
  NotificationEntity,
  NotificationEvent,
  NotificationGroupType,
  NotificationPriority,
  NotificationStatus,
  PushNotificationPayload,
} from '../../../domain/entities/notification.entity';

@Entity({ name: 'notifications' })
export class TypeormNotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  event!: NotificationEvent;

  @Column({ type: 'varchar', default: '1.0' })
  version!: string;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId!: string | null;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.NOT_READ })
  status!: NotificationStatus;

  @Column({ type: 'enum', enum: NotificationGroupType, name: 'group_type' })
  groupType!: NotificationGroupType;

  @Column({ type: 'enum', enum: NotificationPriority })
  priority!: NotificationPriority;

  @Column({ type: 'enum', enum: AlertStatus, name: 'alert_status', default: AlertStatus.NONE })
  alertStatus!: AlertStatus;

  @Column({ type: 'boolean', name: 'show_as_alert' })
  showAsAlert!: boolean;

  @Column({ type: 'jsonb', name: 'notification_center_data', nullable: true })
  notificationCenterData!: NotificationCenterData | null;

  @Column({ type: 'jsonb', nullable: true, name: 'email_data' })
  emailData!: EmailNotificationPayload | null;

  @Column({ type: 'jsonb', nullable: true, name: 'push_data' })
  pushData!: PushNotificationPayload | null;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'read_at', nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  static toNotificationEntity(input: TypeormNotificationEntity): NotificationEntity {
    return new NotificationEntity(
      input.event,
      input.showAsAlert,
      input.groupType,
      input.priority,
      input.userId,
      input.id,
      input.notificationCenterData,
      input.emailData,
      input.pushData,
      input.status,
      input.deletedAt,
      input.readAt,
      input.createdAt,
      input.updatedAt,
      input.version,
      input.alertStatus,
    );
  }
}
