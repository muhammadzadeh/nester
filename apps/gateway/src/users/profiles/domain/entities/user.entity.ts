import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Exception } from '../../../../common/exception';
import { Hash } from '../../../../common/hash';
import { now } from '../../../../common/time';
import { Email, Mobile, UserId, Username } from '../../../../common/types';
export class UserEntity {
  constructor(firstName: string | null, lastName: string | null, email: Email | null, mobile: Mobile | null);
  constructor(
    firstName: string | null,
    lastName: string | null,
    email: Email | null,
    mobile: Mobile | null,
    avatar: string | null,
    avatarId: string | null,
    password: string | null,
    username: Username | null,
    id: UserId,
    fullName: string | null,
    isBlocked: boolean,
    isEmailVerified: boolean,
    isMobileVerified: boolean,
    roleId: string | null,
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
    avatar?: string | null,
    avatarId?: string | null,
    password?: string | null,
    username?: Username | null,
    id?: UserId,
    fullName?: string | null,
    isBlocked?: boolean,
    isEmailVerified?: boolean,
    isMobileVerified?: boolean,
    roleId?: string | null,
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
    this.avatar = avatar ?? null;
    this.avatarId = avatarId ?? null;
    this.password = password ?? null;
    this.username = username ?? null;
    this.id = id ?? randomUUID();
    this.fullName = fullName ?? `${this.firstName ?? ''} ${this.lastName ?? ''}`;
    this.isBlocked = isBlocked ?? false;
    this.isEmailVerified = isEmailVerified ?? false;
    this.isMobileVerified = isMobileVerified ?? false;
    this.roleId = roleId ?? null;
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
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
  avatarId!: string | null;
  password!: string | null;
  username!: Username | null;
  isBlocked!: boolean;
  isEmailVerified!: boolean;
  isMobileVerified!: boolean;
  roleId!: string | null;
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

  hasRole(): boolean {
    return !!this.roleId;
  }

  markMobileAsVerified(): void {
    this.isMobileVerified = true;
  }

  markEmailAsVerified(): void {
    this.isEmailVerified = true;
  }

  updatePassword(plainPassword: string): void {
    this.password = Hash.makeSync(plainPassword);
    this.passwordUpdatedAt = now().toJSDate();
  }

  updateRole(roleId: string): void {
    this.roleId = roleId;
  }

  updateName(firstName: string | null, lastName: string | null): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${this.firstName ?? ''} ${this.lastName ?? ''}`;
  }

  updateAvatar(avatar: string | null, avatarId: string | null): void {
    this.avatar = avatar;
    this.avatarId = avatarId ?? null;
  }

  removeAvatar(): void {
    this.updateAvatar(null, null);
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

@Exception({
  errorCode: 'Invalid_AVATAR',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class InvalidAvatarException extends Error {}
