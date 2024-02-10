import { Logger } from '@nestjs/common';
import { ExceptionMap } from './exception-map';
import { Options } from './option.interface';
const logger = new Logger(ExceptionMapper.name);

export const Exception = (options: Options): ClassDecorator => {
  return (target: any) => {
    ExceptionMap.set(options, target);
  };
};

export function ExceptionMapper(
  exception: new (message?: string, options?: ErrorOptions) => Error,
  message: string,
): MethodDecorator {
  return (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        logger.error(error);
        throw new exception(message, { cause: error });
      }
    };

    return descriptor;
  };
}
