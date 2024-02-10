import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ToLowerCase } from '../../../../common/decorators';
import { Email } from '../../../../common/types';
import { OtpSignup } from '../../providers/otp/otp-signup';
import { GoogleSignup } from '../../providers/google/google-signup';
import { EmailPasswordSignup } from '../../providers/identified-password/identifier-password-signup';

export class OtpSignupDto {
  @IsNotEmpty()
  @IsString()
  identifier!: string;

  toOtpSignup(): OtpSignup {
    return new OtpSignup(this.identifier);
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

export class EmailPasswordSignupDto {
  @IsNotEmpty()
  @IsEmail()
  @Type(() => String)
  @ToLowerCase()
  email!: Email;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @IsStrongPassword({ minLength: 6, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  last_name!: string;

  toEmailPasswordSignup(): EmailPasswordSignup {
    return new EmailPasswordSignup(this.email, this.password, this.first_name, this.last_name);
  }
}
