import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetRoleDto {
  @IsNotEmpty()
  @IsUUID('all')
  id!: string;
}
