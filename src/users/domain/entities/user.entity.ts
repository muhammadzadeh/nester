import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Exception } from '../../../common/exception';
import { Hash } from '../../../common/hash';
import { Email, Mobile, UserId, Username } from '../../../common/types';
import { Permission } from './role.entity';
export class UserEntity {
  constructor(
    firstName: string | null,
    lastName: string | null,
    email: Email | null,
    mobile: Mobile | null,
    avatar: string | null,
  );
  constructor(
    firstName: string | null,
    lastName: string | null,
    email: Email | null,
    mobile: Mobile | null,
    avatar: string | null,
    password: string | null,
    username: Username | null,
    id: UserId,
    fullName: string | null,
    isBlocked: boolean,
    isEmailVerified: boolean,
    isMobileVerified: boolean,
    permissions: Permission[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    lastLoggedInAt: Date | null,
    passwordUpdatedAt: Date | null,
  );
  constructor(
    firstName: string | null,
    lastName: string | null,
    email: Email | null,
    mobile: Mobile | null,
    avatar: string | null,
    password?: string | null,
    username?: Username | null,
    id?: UserId,
    fullName?: string | null,
    isBlocked?: boolean,
    isEmailVerified?: boolean,
    isMobileVerified?: boolean,
    permissions?: Permission[],
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    lastLoggedInAt?: Date | null,
    passwordUpdatedAt?: Date | null,
  ) {
    if (!email && !mobile) {
      throw new MobileOrEmailRequiredException();
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobile = mobile;
    this.avatar = avatar;
    this.password = password ?? null;
    this.username = username ?? null;
    this.id = id ?? randomUUID();
    this.fullName = fullName ?? `${this.firstName ?? ''} ${this.lastName ?? ''}`;
    this.isBlocked = isBlocked ?? false;
    this.isEmailVerified = isEmailVerified ?? false;
    this.isMobileVerified = isMobileVerified ?? false;
    this.permissions = permissions ?? [];
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.deletedAt = deletedAt ?? null;
    this.lastLoggedInAt = lastLoggedInAt ?? null;
    this.passwordUpdatedAt = passwordUpdatedAt ?? null;
  }

  readonly id!: UserId;
  firstName!: string | null;
  lastName!: string | null;
  fullName!: string | null;
  email!: Email | null;
  mobile!: Mobile | null;
  avatar!: string | null;
  password!: string | null;
  username!: Username | null;
  isBlocked!: boolean;
  isEmailVerified!: boolean;
  isMobileVerified!: boolean;
  permissions!: Permission[];
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  lastLoggedInAt!: Date | null;
  passwordUpdatedAt!: Date | null;

  isVerified(): boolean {
    return this.isEmailVerified || this.isMobileVerified;
  }

  hashPassword(): boolean {
    return !!this.password;
  }

  markMobileAsVerified(): void {
    this.isMobileVerified = true;
  }

  markEmailAsVerified(): void {
    this.isEmailVerified = true;
  }

  updatePassword(plainPassword: string): void {
    this.password = Hash.makeSync(plainPassword);
    this.passwordUpdatedAt = new Date();
  }
}

@Exception({
  errorCode: 'USER_NOT_FOUND',
  statusCode: HttpStatus.NOT_FOUND,
})
export class UserNotFoundException extends Error {}

@Exception({
  errorCode: 'MOBILE_OR_EMAIL_REQUIRED',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class MobileOrEmailRequiredException extends Error {}
