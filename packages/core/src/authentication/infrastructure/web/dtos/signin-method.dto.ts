import { IsNotEmpty, IsString } from 'class-validator';
import { Email, Mobile } from '../../../../common/types';
import { IsNotUUID } from '../../../../common/is-not-uuid.validator';
import { ToLowerCase } from '../../../../common/decorators';
import { IsIdentifier } from '../../../../common/is-identifier.validator';

export class SigninMethodDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;
}
