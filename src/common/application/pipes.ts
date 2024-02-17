import { ArgumentMetadata, INestApplication, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '../exception';
import { camelCaseObject } from '../utils';

@Injectable()
class CamelCasePipe implements PipeTransform<any> {
  transform(value: any, _: ArgumentMetadata) {
    if (!value) {
      return value;
    }
    return camelCaseObject(value);
  }
}

export default (app: INestApplication): void => {
  app.useGlobalPipes(
    new CamelCasePipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (e): ValidationException => ValidationException.fromErrors(e),
      stopAtFirstError: true,
    }),
  );
};
