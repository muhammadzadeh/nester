import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

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
  @IsStrongPassword(
    { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: 'minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1' },
  )
  @Type(() => String)
  readonly password!: string;
}
