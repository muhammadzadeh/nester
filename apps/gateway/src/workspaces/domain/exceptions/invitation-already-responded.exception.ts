import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@package/exception/base.exception';
import { ErrorCode } from '@package/types';

export class InvitationAlreadyRespondedException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.INVITATION_ALREADY_RESPONDED;
}
