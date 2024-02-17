import { HttpStatus } from '@nestjs/common';
import { Exception } from '../../../common/exception';

@Exception({ statusCode: HttpStatus.BAD_REQUEST, errorCode: 'USER_NOT_VERIFIED' })
export class UserNotVerifiedException extends Error {}

