import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export const SecurityContext = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getResponse();

    return res.locals.user as User;
  },
);
