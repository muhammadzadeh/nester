import { INestApplication } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Configuration } from '../config';

export default (app: INestApplication): void => {
  const configuration = app.get(Configuration);
  const { sentry: sentry_config, app: app_configs } = configuration;

  if (sentry_config == undefined || !sentry_config.enabled) {
    return;
  }

  Sentry.init({ ...sentry_config, environment: app_configs.env });
};
