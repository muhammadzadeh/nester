import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseGroup } from '../../../../common/types';
import { Permission, RoleEntity } from '../../domain/entities/role.entity';

export class RoleResponse {
  static from(data: RoleEntity): RoleResponse {
    return {
      id: data.id,
      title: data.title,
      permissions: data.permissions,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      isSystemRole: data.isSystemRole,
    };
  }
  @ApiProperty({
    type: String,
    name: 'id',
  })
  @Expose()
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
    name: 'title',
  })
  @Expose()
  @Type(() => String)
  readonly title!: string;

  @ApiProperty({
    type: Permission,
    enum: Permission,
    enumName: 'Permission',
    name: 'permissions',
    isArray: true,
  })
  @Type(() => String)
  @Expose()
  readonly permissions!: Permission[];

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
  @Expose()
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Boolean,
    name: 'is_system_role',
  })
  @Type(() => Boolean)
  @Expose()
  readonly isSystemRole!: boolean;
}
