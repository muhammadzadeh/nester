import {
  CallHandler,
  ExecutionContext,
  INestApplication,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { snackCaseObject } from '../utils';

@Injectable()
class SnackCaseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => snackCaseObject(data)));
  }
}

@Injectable()
class SwaggerNoCacheInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const path: string = Reflect.getMetadata(PATH_METADATA, context.getHandler());
    if (path === 'docs-json' || path == 'docs') {
      SetMetadata('ignoreCache', true);
      return next.handle().pipe(
        tap(() => {
          const ResponseObj = context.switchToHttp().getResponse<FastifyReply>();
          ResponseObj.header('Cache-Control', 'no-cache');
        }),
      );
    }
    return next.handle();
  }
}

export default (app: INestApplication): void => {
  app.useGlobalInterceptors(new SwaggerNoCacheInterceptor());
  app.useGlobalInterceptors(new SnackCaseInterceptor());
};
