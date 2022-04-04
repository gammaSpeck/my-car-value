import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable() // Need not have the Injectable Decorator
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return !!request.session.userId;
  }
}
