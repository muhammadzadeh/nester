import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  AuthorizationGuard,
  CheckPermissionGuard,
  IsUserEnableGuard,
} from '../../authenticate/infrastructure/web/guards';
import { CaptchaGuard } from '../captcha/guards';
import { Configuration } from '../config';
import { ThrottlerBehindProxyGuard } from '../guards/throttler-behind-proxy.guard';

export default (app: NestFastifyApplication): void => {
  const configService = app.get(Configuration);
  const is_swagger_enabled = configService.swagger?.enabled;

  app.useGlobalGuards(app.get(ThrottlerBehindProxyGuard));
  app.useGlobalGuards(app.get(AuthorizationGuard));
  app.useGlobalGuards(app.get(CaptchaGuard));
  app.useGlobalGuards(app.get(CheckPermissionGuard));
  app.useGlobalGuards(app.get(IsUserEnableGuard));
  app.register(
    helmet,
    is_swagger_enabled
      ? {
          contentSecurityPolicy: {
            directives: {
              defaultSrc: [`'self'`],
              styleSrc: [`'self'`, `'unsafe-inline'`],
              imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
              scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            },
          },
        }
      : {},
  );
};
