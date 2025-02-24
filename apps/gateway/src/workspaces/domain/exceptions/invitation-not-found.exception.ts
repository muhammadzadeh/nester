import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@package/exception/base.exception';
import { ErrorCode } from '@package/types';

export class InvitationNotFoundException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.NOT_FOUND;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.INVITATION_NOT_FOUND;
}
