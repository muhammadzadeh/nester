import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserId } from '../../../../../common/types';

export class GetUserDto {
  @IsNotEmpty()
  @IsUUID('all')
  id!: UserId;
}
