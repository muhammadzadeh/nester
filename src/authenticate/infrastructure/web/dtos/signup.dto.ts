import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { IsStrongPassword } from '../../../../common/is-strong-password.validator';
import { Email, Mobile } from '../../../../common/types';
import { SignupByOtpData } from '../../../application/services';
import { SignupByPasswordData } from '../../../application/services';
import { GoogleSignup } from '../../providers/google/google-signup';

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

  toSignupByPasswordData(): SignupByPasswordData {
    return {
      identifier: this.identifier,
      password: this.password,
    };
  }
}
