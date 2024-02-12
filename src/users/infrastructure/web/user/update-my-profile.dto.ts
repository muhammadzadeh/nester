import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  first_name!: string | null;

  @IsOptional()
  @IsString()
  last_name!: string | null;

  @IsOptional()
  @IsUUID('all')
  avatar!: string | null;

  toEntity(): Partial<UserEntity> {
    return {
      firstName: this.first_name,
      lastName: this.last_name,
      avatar: this.avatar,
      fullName: `${this.first_name ?? ''} ${this.last_name ?? ''}`,
    };
  }
}
