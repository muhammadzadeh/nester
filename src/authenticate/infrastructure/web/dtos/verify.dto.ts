import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { VerifyData } from '../../../application';
import { OTPType } from '../../../domain/entities';

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

  toVerifyData(): VerifyData {
    return {
      identifier: this.identifier,
      otp: this.otp,
      type: this.type,
    };
  }
}
