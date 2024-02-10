/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isArray, isEmpty } from 'class-validator';
import { FastifyRequest } from 'fastify';

export type UploadedFiles = AsyncIterableIterator<MultipartFile>;
export const UploadedFiles = createParamDecorator(
  (opt: Parameters<FastifyRequest['files']>[0] | undefined, ctx: ExecutionContext): UploadedFiles =>
    ctx.switchToHttp().getRequest<FastifyRequest>().files(opt),
);

const UniqueArray = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return isArray(obj[key]) ? [...new Set(obj[key])] : isEmpty(obj[key]) ? undefined : [obj[key]];
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const ToArray = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return isArray(obj[key]) ? obj[key] : isEmpty(obj[key]) ? undefined : [obj[key]];
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const ToLowerCase = () => Transform((obj) => obj.value.toLowerCase());

const valueToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  try {
    if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
      return true;
    }
    if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
      return false;
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
};

export { ToArray, ToBoolean, ToLowerCase, UniqueArray };
