import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Permission } from '../../../domain/entities/role.entity';

export class UpdateUserPermissionDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions!: Permission[];

  toEntity(): Partial<UserEntity> {
    return {
      permissions: this.permissions ?? [],
    };
  }
}
