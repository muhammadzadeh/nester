import {
  HttpStatus,
  NotFoundException as NestNotFoundException,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityNotFound,
  EntityRelationNotFound,
} from '../../../prisma-utils/repository/repository.type';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class NotFoundExceptionMapper implements ExceptionMapper {
  map(
    exception:
      | NestNotFoundException
      | EntityNotFound
      | NotFoundException
      | EntityRelationNotFound
  ): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.NOT_FOUND,
      errorCode: 'NOT_FOUND',
    };
  }
}
