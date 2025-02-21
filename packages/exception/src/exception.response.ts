import { HttpStatus } from '@nestjs/common';
import { FlatError } from './exceptions/validation.exception';

export enum Status {
	SUCCESS = 'success',
	FAILURE = 'failure',
}

export interface ExceptionResponse {
	message: string;
	status: Status;
	statusCode: HttpStatus;
	errorCode: string;
	errors?: FlatError[];
	debug?: any;
}
