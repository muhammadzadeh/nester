import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UploadedFiles } from '../../application/usecases/upload/upload.command';

export const GetUploadedFiles = createParamDecorator(
  (
    opt: Parameters<FastifyRequest['files']>[0] | undefined,
    ctx: ExecutionContext,
  ): UploadedFiles =>
    ctx.switchToHttp().getRequest<FastifyRequest>().files(opt),
);
