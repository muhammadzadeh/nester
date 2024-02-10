import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, ValidateIf } from 'class-validator';
import { OtpVerification } from '../../../application';
import { OTPReason, OTPType } from '../../../domain/entities';
import { ToLowerCase } from '../../../../common/decorators';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  otp!: string;

  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @ValidateIf((obj) => obj.type === OTPType.CODE)
  @IsNotEmpty()
  @IsEmail()
  @ToLowerCase()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({ minLength: 6, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })
  new_password!: string;

  toOTPVerification(): OtpVerification {
    return new OtpVerification(this.otp, this.type, OTPReason.RESET_PASSWORD, this.email);
  }
}
