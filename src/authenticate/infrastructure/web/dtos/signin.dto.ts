import { IsEnum, IsNotEmpty, IsOptional, IsString, isEmail } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { OTPReason, OTPType } from '../../../domain/entities';
import { FakeAuth } from '../../providers/fake';
import { GoogleAuth } from '../../providers/google';
import { IdentifierPasswordAuth } from '../../providers/identified-password';
import { OtpAuth } from '../../providers/otp';

export class FakeAuthDto {
  @IsNotEmpty()
  @IsString()
  identifier!: Email | Mobile;

  toFakeAuth() {
    return new FakeAuth(this.identifier);
  }
}

export class IdentifierPasswordAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  identifier!: Email | Mobile;

  @IsNotEmpty()
  @IsString()
  password!: string;

  toIdentifierPasswordAuth() {
    return new IdentifierPasswordAuth(this.identifier, this.password);
  }
}

export class OtpAuthDto {
  @IsNotEmpty()
  @IsString()
  otp!: string;

  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @IsNotEmpty()
  @IsNotUUID()
  @ToLowerCase()
  identifier!: Email | Mobile;

  @IsOptional()
  @IsEnum(OTPReason)
  reason?: OTPReason;

  toOtpAuth(): OtpAuth {
    const email = isEmail(this.identifier) ? this.identifier : undefined;
    const mobile = !isEmail(this.identifier) ? this.identifier : undefined;
    return new OtpAuth(this.otp, this.type, this.reason ?? OTPReason.VERIFY, email, mobile);
  }
}

export class GoogleAuthDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  toGoogleAuth(): GoogleAuth {
    return new GoogleAuth(this.token);
  }
}
