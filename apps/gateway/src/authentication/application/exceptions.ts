import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@package/exception/base.exception';
import { ErrorCode } from '@package/types';

export class UserNotRegisteredException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.USER_NOT_REGISTERED;
}

export class UserAlreadyRegisteredException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.USER_ALREADY_REGISTERED;
}

export class YourAccountIsBlockedException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.FORBIDDEN;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.ACCOUNT_IS_BLOCKED;
}

export class InvalidCredentialException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.FORBIDDEN;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.INVALID_CREDENTIALS;
}

export class InvalidOtpException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.FORBIDDEN;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.INVALID_OTP;
}

export class UserNotVerifiedException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.FORBIDDEN;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.USER_NOT_VERIFIED;
}

export class InvalidIdentifierException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
	readonly useOriginalMessage?: boolean;
	readonly code: ErrorCode = ErrorCode.INVALID_IDENTIFIER;
}
