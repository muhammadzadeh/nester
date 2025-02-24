import { ToLowerCase } from '@package/decorator';
import { Email, Mobile } from '@package/types';
import { IsIdentifier } from '@package/validator/is-identifier.validator';
import { IsNotUUID } from '@package/validator/is-not-uuid.validator';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SendOtp } from '../../../application/services/auth.service';
import { OTPType } from '../../../domain/entities';

export class OtpGenerationDto {
	@IsNotEmpty()
	@IsEnum(OTPType)
	type!: OTPType;

	@IsNotEmpty()
	@IsString()
	@IsNotUUID()
	@ToLowerCase()
	@IsIdentifier()
	identifier!: Email | Mobile;

	toSendOtp(): SendOtp {
		return new SendOtp(this.identifier, this.type);
	}
}
