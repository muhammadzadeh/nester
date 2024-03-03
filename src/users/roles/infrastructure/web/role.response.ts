import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
    name: 'title',
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
  readonly permissions!: Permission[];

  @ApiProperty({
    type: Date,
    name: 'created_at',
  })
  @Type(() => Date)
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'updated_at',
    nullable: true,
  })
  @Type(() => Date)
  readonly updatedAt!: Date;

  @ApiProperty({
    type: Date,
    name: 'deleted_at',
    nullable: true,
  })
  @Type(() => Date)
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Boolean,
    name: 'is_system_role',
  })
  @Type(() => Boolean)
  readonly isSystemRole!: boolean;
}
