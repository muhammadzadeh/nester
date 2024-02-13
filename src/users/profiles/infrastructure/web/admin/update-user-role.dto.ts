import { IsOptional, IsUUID } from 'class-validator';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsUUID('all')
  role_id?: string;

  toEntity(): Partial<UserEntity>{
    return {
      roleId: this.role_id,
    }
  }
}
