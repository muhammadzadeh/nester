import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { IsStrongPassword } from '../../../../common/is-strong-password.validator';
import { Email, Mobile } from '../../../../common/types';
import { SignupByOtpData } from '../../../application';
import { GoogleSignup } from '../../providers/google/google-signup';
import { IdentifierPasswordSignup } from '../../providers/identified-password/identifier-password-signup';

export class SignupByOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;

  toSignupByOtpData(): SignupByOtpData {
    return { identifier: this.identifier };
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
  @IsStrongPassword()
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
