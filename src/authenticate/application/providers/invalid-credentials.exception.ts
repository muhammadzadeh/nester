import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_CREDENTIALS' })
export class InvalidCredentialException extends Error {}

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_OTP' })
export class InvalidOtpException extends Error {}
