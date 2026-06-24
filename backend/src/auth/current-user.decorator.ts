// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserPayload {
  id: string;
  email: string;
  role: string;
}

// Extendemos el tipo Request de Express para que sepa que
// existe request.user con esta forma — esto elimina el "any"
interface RequestWithUser extends Request {
  user: CurrentUserPayload;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
