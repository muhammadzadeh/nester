import { IsEnum, IsNotEmpty, IsString, IsStrongPassword, isEmail } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { OtpVerification } from '../../../application';
import { OTPReason, OTPType } from '../../../domain/entities';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp!: string;

  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @IsNotEmpty()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 6, minLowercase: 0, minUppercase: 2, minNumbers: 2, minSymbols: 0 })
  newPassword!: string;

  toOTPVerification(): OtpVerification {
    const email = isEmail(this.identifier) ? this.identifier : undefined;
    const mobile = !isEmail(this.identifier) ? this.identifier : undefined;
    return new OtpVerification(this.otp, this.type, OTPReason.RESET_PASSWORD, email, mobile);
  }
}
