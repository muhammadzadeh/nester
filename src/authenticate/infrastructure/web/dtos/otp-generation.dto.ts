import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { Email, Mobile } from '../../../../common/types';
import { SendOtp } from '../../../application';
import { OTPType } from '../../../domain/entities';

export class OtpGenerationDto {
  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  identifier!: Email | Mobile;

  toSendOtp(): SendOtp {
    return new SendOtp(this.identifier, this.type);
  }
}
