import { ToLowerCase } from '@repo/decorator';
import { Email, Mobile } from '@repo/types';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';
import { IsNotUUID } from '@repo/validator/is-not-uuid.validator';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerifyData } from '../../../application/services/auth.service';
import { OTPType } from '../../../domain/entities';

export class VerifyDto {
	@IsNotEmpty()
	@IsString()
	otp!: string;

	@IsNotEmpty()
	@IsEnum(OTPType)
	type!: OTPType;

	@IsNotEmpty()
	@IsNotUUID()
	@ToLowerCase()
	@IsIdentifier()
	identifier!: Email | Mobile;

	toVerifyData(): VerifyData {
		return {
			identifier: this.identifier,
			otp: this.otp,
			type: this.type,
		};
	}
}
