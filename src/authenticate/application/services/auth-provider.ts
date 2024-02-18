import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';
import { Email, Mobile } from '../../../common/types';
import { UserEntity } from '../../../users/profiles/domain/entities/user.entity';
export interface AuthProvider {
  authenticate(data: Auth): Promise<AuthUser>;
  signup(data: Auth): Promise<UserEntity>;
  isSupport(auth: Auth): boolean;
}

export interface Auth {}

export enum AuthProviderType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  OTP = 'otp',
  LINKEDIN = 'linkedin',
  IDENTIFIER = 'identifier',
  Fake = 'fake',
}

export class AuthUser {
  constructor(
    readonly providerId: string,
    readonly provider: AuthProviderType,
    readonly email: Email | null,
    readonly mobile: Mobile | null,
    readonly firstName: string | null,
    readonly lastName: string | null,
    readonly avatar: string | null,
    readonly isEmailVerified?: boolean,
    readonly isMobileVerified?: boolean,
  ) {}

  isVerified(): boolean {
    return !!this.isEmailVerified || !!this.isMobileVerified;
  }
}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_CREDENTIALS' })
export class InvalidCredentialException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_OTP' })
export class InvalidOtpException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_NOT_VERIFIED' })
export class UserNotVerifiedException extends Error {}
