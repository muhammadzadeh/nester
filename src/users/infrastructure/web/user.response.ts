import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Email, Mobile, ResponseGroup, UserId, Username } from '../../../common/types';
import { Permission } from '../../domain/entities/user.entity';

export class UserResponse {
  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly id!: UserId;

  @ApiProperty({
    type: String,
    name: 'first_name',
    nullable: true,
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly firstName!: string | null;

  @ApiProperty({
    type: String,
    name: 'last_name',
    nullable: true,
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly lastName!: string | null;

  @ApiProperty({
    type: String,
    name: 'full_name',
    nullable: true,
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly fullName!: string | null;

  @ApiProperty({
    type: String,
    name: 'email',
    nullable: true,
  })
  @Type(() => String)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly email!: Email | null;

  @ApiProperty({
    type: String,
    name: 'mobile',
    nullable: true,
  })
  @Type(() => String)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly mobile!: Mobile | null;

  @ApiProperty({
    type: String,
    name: 'avatar',
    nullable: true,
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly avatar!: string | null;

  @ApiProperty({
    type: String,
    name: 'username',
    nullable: true,
  })
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  @Type(() => String)
  readonly username!: Username | null;

  @ApiProperty({
    type: Boolean,
    name: 'is_blocked',
  })
  @Type(() => Boolean)
  @Expose({ groups: [ResponseGroup.ADMIN, ResponseGroup.ADMIN_LIST] })
  readonly isBlocked!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_email_verified',
  })
  @Type(() => Boolean)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly isEmailVerified!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_mobile_verified',
  })
  @Type(() => Boolean)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly isMobileVerified!: boolean;

  @ApiProperty({
    type: String,
    name: 'permissions',
    isArray: true,
  })
  @Type(() => String)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly permissions!: Permission[];

  @ApiProperty({
    type: Date,
    name: 'created_at',
  })
  @Type(() => Date)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly updatedAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'deleted_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({ groups: [ResponseGroup.ADMIN, ResponseGroup.ADMIN_LIST] })
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'last_logged_in_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly lastLoggedInAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'password_updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({
    groups: [
      ResponseGroup.ADMIN,
      ResponseGroup.ADMIN_LIST,
      ResponseGroup.RESOURCE_OWNER,
      ResponseGroup.RESOURCE_OWNER_LIST,
    ],
  })
  readonly passwordUpdatedAt!: Date | null;
}
