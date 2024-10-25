import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@repo/exception';

export default (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (e): ValidationException => ValidationException.fromErrors(e),
      stopAtFirstError: true,
    }),
  );
};
