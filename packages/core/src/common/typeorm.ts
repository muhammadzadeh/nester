import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const Config: Partial<PostgresConnectionOptions> = {
  entities: ['dist/**/entities/*.entity.js'],
  synchronize: false,
  subscribers: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/migration/*.js'],
  migrationsRun: true,
};


export default Config;
