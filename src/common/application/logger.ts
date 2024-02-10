import { INestApplication } from '@nestjs/common';
import * as requestIp from '@supercharge/request-ip';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Configuration } from '../config';

const isJson = (payload: any): boolean => {
  try {
    JSON.parse(payload);
    return true;
  } catch (error) {
    return false;
  }
};

const getUserIp = (request: any): string | undefined => {
  return requestIp.getClientIp(request);
};

export default (app: INestApplication): void => {
  const logger: WinstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const configuration = app.get(Configuration);

  app.useLogger(logger);
  app.flushLogs();
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('preValidation', (req: any, reply: any, done: any) => {
      logRequest(req, reply).catch((error) => logger.error(error));
      done();
    });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (req: any, reply: any, payload: any, done: any) => {
      logResponse(req, reply, payload).catch((error) => logger.error(error));
      done();
    });

  function shouldIgnoreRoute(req: any): boolean {
    const url: string = req.raw.url;
    const ignoredRoutes = configuration.logger.ignoredRoutes();
    return ignoredRoutes.findIndex((ignoredRoute)=> url.includes(ignoredRoute)) > -1
  }

  async function logRequest(req: any, reply: any): Promise<void> {
    if (shouldIgnoreRoute(req)) {
      return;
    }

    reply.startTime = new Date().getTime();
    const log = {
      context: 'EdgeLogger',
      level: 'info',
      message: 'Incoming Request',
      request_id: req.id,
      http: {
        request: {
          method: req.method,
          ip: getUserIp(req),
          url: req.raw.url,
          query: req.query,
          param: req.param,
          headers: { ...req.headers },
          body: {} as any,
          content: '' as any,
        },
      },
    };

    if (isJson(req.body)) {
      log.http.request.body = JSON.parse(req.body);
    } else {
      log.http.request.content = req.body;
    }

    logger.log(log);
  }

  async function logResponse(req: any, reply: any, payload: any): Promise<void> {
    if (shouldIgnoreRoute(req)) {
      return;
    }

    const log = {
      context: 'EdgeLogger',
      level: +reply.raw.statusCode < 300 && +reply.raw.statusCode >= 200 ? 'info' : 'error',
      message: 'Outgoing Response',
      request_id: req.id,
      http: {
        response: {
          ip: getUserIp(req),
          url: req.raw.url,
          status_code: reply.raw.statusCode,
          duration_ms: new Date().getTime() - reply.startTime,
          body: {},
          content: '',
          user: {
            id: reply?.request?.user?.id,
            email: reply?.request?.user?.email,
            type: reply?.request?.user?.type,
          },
        },
      },
    };

    if (isJson(payload)) {
      log.http.response.body = JSON.parse(payload);
    } else {
      log.http.response.content = payload;
    }

    logger.log(log);
  }
};
