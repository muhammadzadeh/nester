import { ToLowerCase } from '@package/decorator';
import { Email, Mobile } from '@package/types';
import { IsIdentifier } from '@package/validator/is-identifier.validator';
import { IsNotUUID } from '@package/validator/is-not-uuid.validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninMethodDto {
	@IsNotEmpty()
	@IsString()
	@IsNotUUID()
	@ToLowerCase()
	@IsIdentifier()
	identifier!: Email | Mobile;
}
