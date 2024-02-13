import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseGroup } from '../../../../common/types';
import { Permission } from '../../domain/entities/role.entity';

export class RoleResponse {
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
  readonly id!: string;

  @ApiProperty({
    type: String,
    name: 'title',
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
  readonly title!: string;

  @ApiProperty({
    type: Permission,
    enum: Permission,
    enumName: 'Permission',
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
    type: Boolean,
    name: 'is_system_role',
  })
  @Type(() => Boolean)
  @Expose({
    groups: [ResponseGroup.ADMIN, ResponseGroup.ADMIN_LIST],
  })
  readonly isSystemRole!: boolean;
}
