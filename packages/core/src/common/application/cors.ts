import { INestApplication } from '@nestjs/common';

export default (app: INestApplication): void => {
  app.enableCors();
};
