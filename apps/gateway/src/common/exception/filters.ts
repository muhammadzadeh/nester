import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  INestApplication,
  Injectable,
  Logger,
  NotFoundException as NestNotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { captureException } from '@sentry/node';
import { I18nService } from 'nestjs-i18n';
import { Configuration } from '../config';
import { ExceptionMap } from './exception-map';
import { FlatError, ValidationException } from './validation.exception';

enum Status {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

interface ExceptionResponse {
  message: string;
  status: Status;
  code: HttpStatus;
  errorCode: string;
  errors?: FlatError[];
  debug?: any;
}

abstract class CommonExceptionFilter<U> implements ExceptionFilter<U> {
  protected readonly logger = new Logger(CommonExceptionFilter.name);

  constructor(
    private readonly adapterHost: AbstractHttpAdapter,
    protected readonly isDebug: boolean,
    protected readonly i18n: I18nService,
  ) {}

  catch(error: U, host: ArgumentsHost): void {
    this.logInto3rdParties(error, host);

    try {
      const context = host.switchToHttp();
      const response = context.getResponse();
      const request = context.getRequest();
      const traceId = request['id'];

      const responseBody = { ...this.generateResponseBody(error), traceId: traceId };

      this.adapterHost.reply(response, responseBody, responseBody.code);
    } catch (error) {
      this.logger.error(error);
    }
  }

  protected abstract generateResponseBody(error: U): ExceptionResponse;

  protected logInto3rdParties(_error: U, _host: ArgumentsHost): void {}
}

@Catch(NestNotFoundException)
@Injectable()
class NotFoundExceptionFilter extends CommonExceptionFilter<NestNotFoundException> {
  protected readonly code = 404;

  protected generateResponseBody(exception: NestNotFoundException): ExceptionResponse {
    const errorCode = 'NOT_FOUND';
    const translatedMessage = this.i18n.t<string, string>(`messages.${errorCode}`);
    return {
      message: exception.message ?? translatedMessage,
      status: Status.FAILURE,
      code: this.code,
      errorCode: 'NOT_FOUND',
    };
  }
}

@Catch(ValidationException)
@Injectable()
class ValidationExceptionFilter extends CommonExceptionFilter<ValidationException> {
  protected readonly code = 400;

  protected generateResponseBody(exception: ValidationException): ExceptionResponse {
    const errorCode = 'INVALID_INPUTS';
    const message = this.i18n.t<string, string>(`messages.${errorCode}`);
    return {
      message,
      status: Status.FAILURE,
      code: this.code,
      errorCode: errorCode,
      errors: exception.getFlatErrors(),
    };
  }
}

@Catch(BadRequestException)
@Injectable()
class BadRequestExceptionFilter extends CommonExceptionFilter<BadRequestException> {
  protected readonly code = 400;

  protected generateResponseBody(exception: BadRequestException): ExceptionResponse {
    const errorCode = 'BAD_REQUEST';
    const message = this.i18n.t<string, string>(`messages.${errorCode}`);
    return {
      message,
      status: Status.FAILURE,
      code: this.code,
      errorCode: errorCode,
      debug: this.isDebug ? JSON.parse(JSON.stringify(exception, Object.getOwnPropertyNames(exception))) : {},
    };
  }
}

@Catch(UnauthorizedException)
@Injectable()
class UnauthorizedExceptionFilter extends CommonExceptionFilter<UnauthorizedExceptionFilter> {
  protected readonly code = 401;

  protected generateResponseBody(): ExceptionResponse {
    const errorCode = 'NOT_AUTHORIZED';
    const message = this.i18n.t<string, string>(`messages.${errorCode}`);
    return { message, status: Status.FAILURE, code: this.code, errorCode: errorCode };
  }
}

@Catch(ForbiddenException)
@Injectable()
class ForbiddenExceptionFilter extends CommonExceptionFilter<ForbiddenException> {
  protected readonly code = 403;

  protected generateResponseBody(): ExceptionResponse {
    const errorCode = 'MISSING_PERMISSION';
    const message = this.i18n.t<string, string>(`messages.${errorCode}`);
    return { message, status: Status.FAILURE, code: this.code, errorCode: errorCode };
  }
}

@Catch(ThrottlerException)
@Injectable()
class ThrottlerExceptionFilter extends CommonExceptionFilter<ForbiddenException> {
  protected readonly code = 429;

  protected generateResponseBody(): ExceptionResponse {
    const errorCode = 'RATE_LIMIT';
    const message = this.i18n.t<string, string>(`messages.${errorCode}`);
    return { message, status: Status.FAILURE, code: this.code, errorCode: errorCode };
  }
}

@Catch()
@Injectable()
class GlobalExceptionFilter extends CommonExceptionFilter<any> {
  protected readonly code = 500;

  protected generateResponseBody(exception: any): ExceptionResponse {
    const exceptionResult: ExceptionResponse = {
      message: '',
      status: Status.FAILURE,
      code: this.code,
      debug: this.isDebug ? JSON.parse(JSON.stringify(exception, Object.getOwnPropertyNames(exception))) : {},
      errorCode: 'UNEXPECTED_ERROR',
    };

    const mappedExceptionData = ExceptionMap.get(exception);

    if (mappedExceptionData) {
      exceptionResult.code = mappedExceptionData.statusCode;
      exceptionResult.errorCode = mappedExceptionData.errorCode;
    }

    const message = this.i18n.t<string, string>(`messages.${exceptionResult.errorCode}`);
    exceptionResult.message = message;

    return exceptionResult;
  }

  protected logInto3rdParties(exception: any, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const extra = {
      type: host.getType(),
      args: host.getArgs(),
      request: context?.getRequest(),
      response: context?.getResponse(),
    };
    this.logger.error(exception);
    captureException(exception, { user: extra.request?.user, extra: extra });
  }
}

export default (app: INestApplication): void => {
  const { debug } = app.get(Configuration);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const i18n = app.get<I18nService>(I18nService);

  app.useGlobalFilters(
    new GlobalExceptionFilter(httpAdapter, debug, i18n),
    new UnauthorizedExceptionFilter(httpAdapter, debug, i18n),
    new ForbiddenExceptionFilter(httpAdapter, debug, i18n),
    new ValidationExceptionFilter(httpAdapter, debug, i18n),
    new BadRequestExceptionFilter(httpAdapter, debug, i18n),
    new NotFoundExceptionFilter(httpAdapter, debug, i18n),
    new ThrottlerExceptionFilter(httpAdapter, debug, i18n),
  );
};
