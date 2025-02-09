import { ToLowerCase } from '@repo/decorator';
import { Email, Mobile } from '@repo/types';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';
import { IsNotUUID } from '@repo/validator/is-not-uuid.validator';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninMethodDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;
}
