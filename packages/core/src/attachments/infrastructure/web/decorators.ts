import { MultipartFile } from '@fastify/multipart';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Files = createParamDecorator(
  (_opt: unknown, ctx: ExecutionContext): AsyncIterableIterator<MultipartFile> => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const files = request.files();
    return files;
  },
);
