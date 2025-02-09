import { Permission, UserId } from '@repo/types';
import { now } from '@repo/utils/time';
import { randomUUID } from 'crypto';
export class RoleEntity {
  constructor(title: string, permissions: Permission[]);
  constructor(
    title: string,
    permissions: Permission[],
    id: UserId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    isSystemRole: boolean,
  );
  constructor(
    title: string,
    permissions: Permission[],
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    isSystemRole?: boolean,
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.permissions = permissions ?? [];
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
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
