import { UserId } from '@package/types';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserDto {
	@IsNotEmpty()
	@IsUUID('4')
	id!: UserId;
}
