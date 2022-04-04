import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * In order to use this Param decorator, the parent or any
 * ancestor class must have `@UseInterceptors(CurrentUserInterceptor)`
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
