import { IsNotEmpty } from 'class-validator';
import { ToLowerCase } from '@package/decorator';
import { IsIdentifier } from '@package/validator/is-identifier.validator';

export class IdentifierDto {
	@IsNotEmpty()
	@ToLowerCase()
	@IsIdentifier()
	identifier!: string;
}
