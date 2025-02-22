import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types';

export class WorkspaceNotFoundException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.NOT_FOUND;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.WORKSPACE_NOT_FOUND;
}
