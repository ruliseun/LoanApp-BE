import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LeanUser } from '../../modules/user/user.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LeanUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as LeanUser;
  },
);
