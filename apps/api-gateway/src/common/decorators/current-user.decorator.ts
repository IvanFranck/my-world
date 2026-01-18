// src/common/decorators/current-user.decorator.ts
import { USER_ID_HEADER } from '@my-website/constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers[USER_ID_HEADER as string] as string;
  },
);
