import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { Email, Mobile } from '../../../../common/types';
import { GoogleSignup } from '../../providers/google/google-signup';
import { IdentifierPasswordSignup } from '../../providers/identified-password/identifier-password-signup';
import { OtpSignup } from '../../providers/otp/otp-signup';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { IsIdentifier } from '../../../../common/is-identifier.validator';

export class OtpSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;

  toOtpSignup(): OtpSignup {
    return new OtpSignup(this.identifier);
  }
}

export class GoogleSignupDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  toGoogleSignup(): GoogleSignup {
    return new GoogleSignup(this.token);
  }
}

export class IdentifierPasswordSignupDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @IsStrongPassword({ minLength: 6, minLowercase: 0, minUppercase: 2, minNumbers: 2, minSymbols: 0 })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  lastName!: string;

  toIdentifierPasswordSignup(): IdentifierPasswordSignup {
    return new IdentifierPasswordSignup(this.identifier, this.password, this.firstName, this.lastName);
  }
}
