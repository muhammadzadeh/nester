import { INestApplication } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Configuration } from '@repo/config';

export default (app: INestApplication): void => {
  const configuration = app.get(Configuration);
  const { sentry: sentryConfig, app: appConfigs } = configuration;

  if (sentryConfig == undefined || !sentryConfig.enabled) {
    return;
  }

  Sentry.init({ ...sentryConfig, environment: appConfigs.env });
};
