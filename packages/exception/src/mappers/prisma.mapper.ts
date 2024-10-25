import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ExceptionResponse } from '../exception.response';
import { IllegalStateException } from '../illegal-state.exception';
import { ConflictExceptionMapper } from './conflict.mapper';
import { ExceptionMapper } from './exception-mapper';
import { GlobalExceptionMapper } from './global.mapper';
import { NotFoundExceptionMapper } from './not-found.mapper';

export class PrismaExceptionMapper implements ExceptionMapper {
  map(exception: PrismaClientKnownRequestError): ExceptionResponse {
    switch (exception.code) {
      case 'P2002':
        return new ConflictExceptionMapper().map(
          new ConflictException(exception.message, {
            cause: exception,
          })
        );
      case 'P2025':
        return new NotFoundExceptionMapper().map(
          new NotFoundException(exception.message, {
            cause: exception,
          })
        );
      default:
        return new GlobalExceptionMapper().map(
          new IllegalStateException(exception.message, {
            cause: exception,
          })
        );
    }
  }
}
