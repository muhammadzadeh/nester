import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile, UserId, Username } from '../../../../common/types';
import { ImpersonationData, SigninByOtpData, SigninByPasswordData } from '../../../application/services/auth.service';
import { OTPType } from '../../../domain/entities';

export class ImpersonationDto {
  @IsNotEmpty()
  @IsString()
  identifier!: Email | Mobile | UserId | Username;

  toImpersonationData(): ImpersonationData {
    return {
      identifier: this.identifier,
    };
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
