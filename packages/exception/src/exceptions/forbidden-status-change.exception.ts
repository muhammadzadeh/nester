import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@repo/types';
import { BaseHttpException } from '../base.exception';

export class ForbiddenStatusChangeException extends BaseHttpException {
	readonly code = ErrorCode.FORBIDDEN_STATE_CHANGE;
	readonly status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
	readonly useOriginalMessage?: boolean = false;
}
