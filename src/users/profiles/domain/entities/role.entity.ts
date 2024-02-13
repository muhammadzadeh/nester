import { randomUUID } from 'crypto';
import { UserId } from '../../../common/types';
export class RoleEntity {
  constructor(title: string, permissions: Permission[]);
  constructor(
    title: string,
    permissions: Permission[],
    id: UserId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    isSystemRole: boolean
  );
  constructor(
    title: string,
    permissions: Permission[],
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    isSystemRole?: boolean
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.permissions = permissions ?? [];
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.deletedAt = deletedAt ?? null;
    this.isSystemRole = isSystemRole ?? false;
  }

  readonly id!: string;
  title!: string;
  permissions!: Permission[];
  readonly createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  readonly isSystemRole!: boolean;
}

export enum Permission {
  MANAGE_EVERY_THINGS = '*',
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  READ_ATTACHMENTS = 'read:attachments',
  WRITE_ATTACHMENTS = 'write:attachments',
  READ_NOTIFICATIONS = 'read:notifications',
  WRITE_NOTIFICATIONS = 'write:notifications',

}
