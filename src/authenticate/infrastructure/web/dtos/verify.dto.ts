import { IsEnum, IsNotEmpty, IsString, isEmail } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { OTPReason, OTPType } from '../../../domain/entities';
import { OtpAuth } from '../../providers/otp';
import { IsIdentifier } from '../../../../common/is-identifier.validator';

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

  toOtpAuth(): OtpAuth {
    const email = isEmail(this.identifier) ? this.identifier : undefined;
    const mobile = !isEmail(this.identifier) ? this.identifier : undefined;
    return new OtpAuth(this.otp, this.type, OTPReason.VERIFY, email, mobile);
  }
}
