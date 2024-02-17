import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Email, Mobile, UserId, Username } from '../../../../../common/types';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UserResponse {
  static from(data: UserEntity): UserResponse {
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      avatar: data.avatar,
      username: data.username,
      isBlocked: data.isBlocked,
      isEmailVerified: data.isEmailVerified,
      isMobileVerified: data.isMobileVerified,
      roleId: data.roleId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      lastLoggedInAt: data.lastLoggedInAt,
      passwordUpdatedAt: data.passwordUpdatedAt,
    };
  }

  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Expose()
  @Type(() => String)
  readonly id!: UserId;

  @ApiProperty({
    type: String,
    name: 'first_name',
    nullable: true,
  })
  @Expose()
  @Type(() => String)
  readonly firstName!: string | null;

  @ApiProperty({
    type: String,
    name: 'last_name',
    nullable: true,
  })
  @Expose()
  @Type(() => String)
  readonly lastName!: string | null;

  @ApiProperty({
    type: String,
    name: 'full_name',
    nullable: true,
  })
  @Expose()
  @Type(() => String)
  readonly fullName!: string | null;

  @ApiProperty({
    type: String,
    name: 'email',
    nullable: true,
  })
  @Type(() => String)
  @Expose()
  readonly email!: Email | null;

  @ApiProperty({
    type: String,
    name: 'mobile',
    nullable: true,
  })
  @Type(() => String)
  @Expose()
  readonly mobile!: Mobile | null;

  @ApiProperty({
    type: String,
    name: 'avatar',
    nullable: true,
  })
  @Expose()
  @Type(() => String)
  readonly avatar!: string | null;

  @ApiProperty({
    type: String,
    name: 'username',
    nullable: true,
  })
  @Expose()
  @Type(() => String)
  readonly username!: Username | null;

  @ApiProperty({
    type: Boolean,
    name: 'is_blocked',
  })
  @Type(() => Boolean)
  @Expose()
  readonly isBlocked!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_email_verified',
  })
  @Type(() => Boolean)
  @Expose()
  readonly isEmailVerified!: boolean;

  @ApiProperty({
    type: Boolean,
    name: 'is_mobile_verified',
  })
  @Type(() => Boolean)
  @Expose()
  readonly isMobileVerified!: boolean;

  @ApiProperty({
    type: String,
    name: 'role_id',
    nullable: true,
  })
  @Type(() => String)
  @Expose()
  readonly roleId!: string | null;

  @ApiProperty({
    type: Date,
    name: 'created_at',
  })
  @Type(() => Date)
  @Expose()
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose()
  readonly updatedAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'deleted_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose()
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'last_logged_in_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose()
  readonly lastLoggedInAt!: Date | null;

  @ApiProperty({
    type: Date,
    name: 'password_updated_at',
    nullable: true,
  })
  @Type(() => Date)
  @Expose()
  readonly passwordUpdatedAt!: Date | null;
}
