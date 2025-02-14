import { Permission } from '@repo/types';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Permission, { each: true })
  readonly permissions!: Permission[];
}
