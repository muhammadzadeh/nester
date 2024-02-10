const apmConfig = {
  serverUrl: 'ELASTIC_APM_SERVER_URL',
  environment: 'ENVIRONMENT',
  active: 'ELASTIC_APM_ENABLED',
  logLevel: 'debug',
};

require('elastic-apm-node').start(apmConfig);
