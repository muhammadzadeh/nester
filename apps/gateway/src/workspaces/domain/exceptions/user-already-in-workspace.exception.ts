import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types';

export class UserAlreadyInWorkspaceException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.CONFLICT;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.USER_ALREADY_IN_WORKSPACE;
}
