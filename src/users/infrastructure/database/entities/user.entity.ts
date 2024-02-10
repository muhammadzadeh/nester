import { Check, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Email, Mobile, UserId, Username } from '../../../../common/types';
import { Permission, UserEntity } from '../../../domain/entities/user.entity';

@Entity({
  name: 'users',
})
@Check('CK_USERS_IDENTIFIER', 'email IS NOT NULL OR mobile IS NOT NULL')
export class TypeormUserEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: UserId;

  @Column({type: 'varchar', name: 'fist_name', nullable: true})
  readonly firstName!: string | null;

  @Column({type: 'varchar', name: 'last_name', nullable: true})
  readonly lastName!: string | null;

  @Column({type: 'varchar', name: 'full_name', nullable: true})
  readonly fullName!: string | null;

  @Column({type: 'varchar', name: 'email', nullable: true})
  readonly email!: Email | null;

  @Column({type: 'varchar', name: 'mobile', nullable: true})
  readonly mobile!: Mobile | null;

  @Column({type: 'varchar', name: 'avatar', nullable: true})
  readonly avatar!: string | null;

  @Column({type: 'varchar', name: 'password', nullable: true})
  readonly password!: string | null;

  @Column({type: 'varchar', name: 'username', nullable: true})
  readonly username!: Username | null;

  @Column({ type: 'boolean', name: 'is_blocked', default: false})
  readonly isBlocked!: boolean;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false})
  readonly isEmailVerified!: boolean;

  @Column({ type: 'boolean', name: 'is_mobile_verified', default: false})
  readonly isMobileVerified!: boolean;

  @Column({type: 'varchar', name: 'permissions', default: [], array: true})
  readonly permissions!: Permission[];

  @CreateDateColumn({name: 'created_at'})
  readonly createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at'})
  readonly updatedAt!: Date;

  @DeleteDateColumn({name: 'deleted_at'})
  readonly deletedAt!: Date | null;

  @Column({type: 'timestamptz', name: 'last_logged_in_at', nullable: true})
  readonly lastLoggedInAt!: Date | null;

  static toUserEntity(item: TypeormUserEntity): UserEntity {
    return new UserEntity(
      item.firstName,
      item.lastName,
      item.email,
      item.mobile,
      item.avatar,
      item.password,
      item.username,
      item.id,
      item.fullName,
      item.isBlocked,
      item.isEmailVerified,
      item.isMobileVerified,
      item.permissions,
      item.createdAt,
      item.updatedAt,
      item.deletedAt,
      item.lastLoggedInAt,
    );
  }
}
