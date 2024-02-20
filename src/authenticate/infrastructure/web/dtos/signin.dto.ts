import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { SigninByOtpData, SigninByPasswordData } from '../../../application/services';
import { OTPType } from '../../../domain/entities';
import { FakeAuth } from '../../providers/fake';
import { GoogleAuth } from '../../providers/google';

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
  @IsIdentifier()
  identifier!: Email | Mobile;

  @IsNotEmpty()
  @IsString()
  password!: string;

  toSigninByPasswordData(): SigninByPasswordData {
    return {
      identifier: this.identifier,
      password: this.password,
    };
  }
}

export class SigninByOtpDto {
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

  toSigninByOtpData(): SigninByOtpData {
    return {
      identifier: this.identifier,
      otp: this.otp,
      type: this.type,
    };
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
