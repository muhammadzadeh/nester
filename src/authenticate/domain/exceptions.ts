import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../common/exception';

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_NOT_REGISTERED' })
export class UserNotRegisteredException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_ALREADY_REGISTERED' })
export class UserAlreadyRegisteredException extends Error {}

@Exception({
  errorCode: 'ACCOUNT_IS_BLOCKED',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class YourAccountIsBlockedException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_CREDENTIALS' })
export class InvalidCredentialException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_OTP' })
export class InvalidOtpException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_NOT_VERIFIED' })
export class UserNotVerifiedException extends Error {}