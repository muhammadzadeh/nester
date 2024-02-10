import { randomUUID } from 'crypto';

export class NotificationPushTokenEntity {
  constructor(userId: string, token: string, provider: PushProvider);
  constructor(
    userId: string,
    token: string,
    provider: PushProvider,
    id: string,
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  );
  constructor(
    userId: string,
    token: string,
    provider: PushProvider,
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id ?? randomUUID();
    this.token = token;
    this.userId = userId;
    this.provider = provider;
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  readonly id!: string;
  readonly token!: string;
  readonly userId!: string;
  readonly provider!: PushProvider;
  deletedAt!: Date | null;
  readonly createdAt!: Date;
  updatedAt!: Date;
}

export enum PushProvider {
  FCM = 'fcm',
  APN = 'apn',
}
