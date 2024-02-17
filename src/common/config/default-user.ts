import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { IsStrongPassword } from '../is-strong-password.validator';

export class DefaultUserConfig {
  @IsNotEmpty()
  @IsEmail()
  @Type(() => String)
  readonly email!: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Type(() => String)
  readonly mobile!: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @Type(() => String)
  readonly password!: string;
}
