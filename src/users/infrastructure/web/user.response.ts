import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Email, Mobile, UserId, Username } from '../../../common/types';
import { Permission } from '../../domain/entities/user.entity';

export class UserResponse {
  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly id!: UserId;

  @ApiProperty({
    type: String,
    name: 'first_name',
    nullable: true,
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly firstName!: string | null;

  @ApiProperty({
    type: String,
    name: 'last_name',
    nullable: true,
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly lastName!: string | null;

  @ApiProperty({
    type: String,
    name: 'full_name',
    nullable: true,
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly fullName!: string | null;

  @ApiProperty({
    type: String,
    name: 'email',
    nullable: true,
  })
  @Type(() => String)
  @Expose({ groups: [] })
  readonly email!: Email | null;

  @ApiProperty({
    type: String,
    name: 'mobile',
    nullable: true,
  })
  @Type(() => String)
  @Expose({ groups: [] })
  readonly mobile!: Mobile | null;

  @ApiProperty({
    type: String,
    name: 'avatar',
    nullable: true,
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly avatar!: string | null;

  @ApiProperty({
    type: String,
    name: 'username',
    nullable: true,
  })
  @Expose({ groups: [] })
  @Type(() => String)
  readonly username!: Username | null;

  @ApiProperty({
    type: Boolean,
    name: 'is_blocked',
  })
  @Type(() => Boolean)
  @Expose({ groups: [] })
  readonly isBlocked!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_email_verified',
  })
  @Type(() => Boolean)
  @Expose({ groups: [] })
  readonly isEmailVerified!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_mobile_verified',
  })
  @Type(() => Boolean)
  @Expose({ groups: [] })
  readonly isMobileVerified!: boolean;

  @ApiProperty({
    type: String,
    name: 'permissions',
    isArray: true,
  })
  @Type(() => String)
  @Expose({ groups: [] })
  readonly permissions!: Permission[];

  @ApiProperty({
    type: Date,
    name: 'created_at',
  })
  @Type(() => Date)
  @Expose({ groups: [] })
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({ groups: [] })
  readonly updatedAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'deleted_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({ groups: [] })
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'last_logged_in_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({ groups: [] })
  readonly lastLoggedInAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'password_updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose({ groups: [] })
  readonly passwordUpdatedAt!: Date | null;
}
