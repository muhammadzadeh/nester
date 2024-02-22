import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { SendOtp } from '../../../application/services/auth.service';
import { OTPType } from '../../../domain/entities';
import { IsIdentifier } from '../../../../common/is-identifier.validator';

export class OtpGenerationDto {
  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;

  toSendOtp(): SendOtp {
    return new SendOtp(this.identifier, this.type);
  }
}
