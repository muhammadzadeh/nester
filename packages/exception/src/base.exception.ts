import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@package/types';

export abstract class BaseError extends Error {
	abstract readonly code: ErrorCode;
}

export abstract class BaseHttpException extends BaseError {
	abstract readonly status: HttpStatus;
	abstract readonly useOriginalMessage?: boolean;
}
