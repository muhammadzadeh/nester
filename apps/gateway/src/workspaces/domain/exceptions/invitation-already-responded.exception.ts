import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types';

export class InvitationAlreadyRespondedException extends BaseHttpException {
	readonly status: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
	readonly useOriginalMessage?: boolean | undefined;
	readonly code: ErrorCode = ErrorCode.INVITATION_ALREADY_RESPONDED;
}
