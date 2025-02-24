import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@package/exception/base.exception';
import { ErrorCode } from '@package/types';

export class WorkspaceNotFoundException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.NOT_FOUND;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.WORKSPACE_NOT_FOUND;
}
