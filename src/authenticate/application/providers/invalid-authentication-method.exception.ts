import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'INVALID_AUTHENTICATION_METHOD' })
export class InvalidAuthenticationMethodException extends Error {}
