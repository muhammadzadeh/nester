import { randomUUID } from 'crypto';
import { MulticastMessage } from 'firebase-admin/messaging';

export class NotificationEntity {
  constructor(
    event: NotificationEvent,
    showAsAlert?: boolean,
    groupType?: NotificationGroupType,
    priority?: NotificationPriority,
  );
  constructor(
    event: NotificationEvent,
    showAsAlert: boolean,
    groupType: NotificationGroupType,
    priority: NotificationPriority,
    userId: string | null,
    id: string,
    notificationCenterData: NotificationCenterData | null,
    emailData: EmailNotificationPayload | null,
    pushData: PushNotificationPayload | null,
    status: NotificationStatus,
    deletedAt: Date | null,
    readAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    version: string,
    alertStatus: AlertStatus,
  );
  constructor(
    event: NotificationEvent,
    showAsAlert?: boolean,
    groupType?: NotificationGroupType,
    priority?: NotificationPriority,
    userId?: string | null,
    id?: string,
    notificationCenterData?: NotificationCenterData | null,
    emailData?: EmailNotificationPayload | null,
    pushData?: PushNotificationPayload | null,
    status?: NotificationStatus,
    deletedAt?: Date | null,
    readAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    version?: string,
    alertStatus?: AlertStatus,
  ) {
    this.userId = userId ?? null;
    this.event = event;
    this.version = version ?? '3.0';
    this.groupType = groupType ?? NotificationGroupType.INFORM;
    this.priority = priority ?? NotificationPriority.MEDIUM;
    this.showAsAlert = showAsAlert ?? false;
    this.notificationCenterData = notificationCenterData ?? null;
    this.id = id ?? randomUUID();
    this.emailData = emailData ?? null;
    this.pushData = pushData ?? null;
    this.status = status ?? NotificationStatus.NOT_READ;
    this.deletedAt = deletedAt ?? null;
    this.readAt = readAt ?? null;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.initialVirtualFields();
    this.alertStatus = alertStatus ?? (showAsAlert ? AlertStatus.NOT_READ : AlertStatus.NONE);
  }

  readonly id!: string;
  readonly event!: NotificationEvent;
  readonly version!: string;
  userId!: string | null;
  status!: NotificationStatus;
  readonly groupType!: NotificationGroupType;
  readonly priority!: NotificationPriority;
  readonly showAsAlert!: boolean;
  alertStatus!: AlertStatus;
  showInNotificationCenter!: boolean;
  notificationCenterData!: NotificationCenterData | null;
  emailData!: EmailNotificationPayload | null;
  pushData!: PushNotificationPayload | null;
  deletedAt!: Date | null;
  readAt!: Date | null;
  readonly createdAt!: Date;
  updatedAt!: Date;

  title?: string;
  description?: string;
  ctas?: NotificationCTA[];

  markAsRead(): void {
    this.status = NotificationStatus.READ;
    this.readAt = new Date();
    this.markAlertAsSeen();
  }

  markAlertAsSeen(): void {
    this.alertStatus = AlertStatus.READ;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setEmailData(input: EmailNotificationPayload): void {
    this.emailData = input;
  }

  setPushData(input: PushNotificationPayload): void {
    this.pushData = input;
  }

  setNotificationCenterData(input: NotificationCenterData): void {
    this.notificationCenterData = input;
    this.showInNotificationCenter = true;
    this.initialVirtualFields();
  }

  shouldSentByEmail(): boolean {
    return !!this.emailData;
  }

  shouldSentByPush(): boolean {
    return !!this.pushData;
  }

  private initialVirtualFields() {
    this.title = this.notificationCenterData?.title;
    this.description = this.notificationCenterData?.description;
    this.ctas = this.notificationCenterData?.ctas ?? [];
  }
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH = 'push',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum NotificationChannelStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum NotificationStatus {
  NOT_READ = 'not_read',
  READ = 'read',
}

export enum NotificationGroupType {
  SUCCESS = 'success',
  INFORM = 'inform',
  FAILURE = 'failure',
}

export enum AlertStatus {
  NONE = 'none',
  NOT_READ = 'not_read',
  READ = 'read',
}

export interface NotificationCTA {
  title: string;
  url: string;
  isMain: boolean;
}

export class NotificationCenterData {
  title!: string;
  description?: string;
  ctas?: NotificationCTA[];
}

export type EmailNotificationPayload = {
  to: string;
  title: string | undefined;
  template: string;
  body: {
    [key: string]: string | number | boolean;
  };
};

export type PushNotificationPayload = MulticastMessage;

export enum NotificationEvent {
  VERIFY_PHONE_REQUESTED = 'verify_phone_requested',
  USER_JOINED = 'user_joined',
  USER_PASSWORD_CHANGED = 'user_password_changed',
  OTP_GENERATED = 'otp_generated',
}
