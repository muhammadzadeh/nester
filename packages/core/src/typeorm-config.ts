import { plainToInstance } from 'class-transformer';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { PostgresQueryRunner } from 'typeorm/driver/postgres/PostgresQueryRunner';
import { Configuration } from './common/config';
import { DefaultConfigLoaderService } from './common/config/services';

if (process.env.NODE_ENV === 'test') {
  const oldQuery = PostgresQueryRunner.prototype['query'];
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  PostgresQueryRunner.prototype['query'] = function (this, query, params, usr) {
    if (query.startsWith('CREATE TABLE')) {
      query = 'CREATE UNLOGGED TABLE' + query.substring(12);
    }
    return oldQuery.call(this, query, params, usr);
  };
}

function getDatabaseConfigs() {
  const defaultConfigLoader = new DefaultConfigLoaderService('config.yml');
  const defaultConfig = defaultConfigLoader.getMappedConfig<Configuration>();
  const configInstance = plainToInstance(Configuration, defaultConfig);
  configInstance.validate();
  return configInstance;
}

export const ds = new DataSource({
  ...getDatabaseConfigs().database,
  entities: [join(__dirname, './**/entities/*.entity.js')],
  synchronize: false,
  subscribers: [join(__dirname, './**/entities/*.entity.js')],
  migrations: [join(__dirname, './**/migration/*.js')],
  migrationsRun: true,
});
