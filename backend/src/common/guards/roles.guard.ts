import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required — allow all
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const role = request.headers['x-role'];

    if (!role) {
      throw new ForbiddenException('Missing x-role header. Provide one of: candidate, recruiter, alumni, placement_officer');
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Role '${role}' is not authorized. Required: ${requiredRoles.join(' | ')}`,
      );
    }

    return true;
  }
}
