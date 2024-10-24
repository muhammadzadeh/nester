import './common/apm';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { randomUUID } from 'crypto';
import { AppModule } from './app/app.module';
import configureGlobalCors from './common/application/cors';
import configureGlobalInterceptors from './common/application/interceptors';
import configureGlobalLogger from './common/application/logger';
import configureGlobalMultipart from './common/application/multipart';
import configureGlobalPipes from './common/application/pipes';
import configureSecurity from './common/application/security';
import configureSentry from './common/application/sentry';
import configureSwagger from './common/application/swagger';
import configureGlobalTransformers from './common/application/transformers';
import { Configuration } from './common/config';
import configureGlobalFilters from './common/exception/filters';

async function bootstrap() {
  const fastify = new FastifyAdapter({
    maxParamLength: 500,
    trustProxy: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
    genReqId() {
      return randomUUID();
    },
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify, {
    bufferLogs: true,
    rawBody: true,
  });
  app.enableShutdownHooks();
  configureGlobalLogger(app);
  configureGlobalCors(app);
  await configureGlobalMultipart(app);
  configureGlobalTransformers(app.select(AppModule));
  configureSwagger(app);
  configureSentry(app);

  configureGlobalFilters(app);
  configureGlobalInterceptors(app);
  configureGlobalPipes(app);
  configureSecurity(app);

  const PORT = process.env.PORT || app.get(Configuration).http.port || 3000;

  return app.listen(PORT, '0.0.0.0');
}
bootstrap();
