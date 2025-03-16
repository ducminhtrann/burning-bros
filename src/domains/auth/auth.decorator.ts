import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: unknown | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);

export const Language = createParamDecorator(
  (data: unknown | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers?.['accept-language'] || 'en';
  },
);
