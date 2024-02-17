import { IsEnum, IsNotEmpty, IsString, isEmail } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsStrongPassword } from '../../../../common/is-strong-password.validator';
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
  @IsStrongPassword()
  newPassword!: string;

  toOTPVerification(): OtpVerification {
    const email = isEmail(this.identifier) ? this.identifier : undefined;
    const mobile = !isEmail(this.identifier) ? this.identifier : undefined;
    return new OtpVerification(this.otp, this.type, OTPReason.RESET_PASSWORD, email, mobile);
  }
}
