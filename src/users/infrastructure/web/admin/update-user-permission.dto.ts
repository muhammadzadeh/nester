import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Permission, UserEntity } from '../../../domain/entities/user.entity';

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
