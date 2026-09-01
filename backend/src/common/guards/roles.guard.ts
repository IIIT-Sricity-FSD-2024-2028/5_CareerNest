import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

export interface RequestUser {
  userId: number | null;
  role: string;
  collegeId: number | null;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const role = (request.headers['x-role'] as string) || '';
    const userId = request.headers['x-user-id'] ? +request.headers['x-user-id'] : null;
    const collegeIdRaw = request.headers['x-college-id'];
    const collegeId =
      collegeIdRaw && collegeIdRaw !== 'null' && collegeIdRaw !== '' ? +collegeIdRaw : null;

    // Attach user context to the request for use in controllers
    request.user = { userId, role, collegeId } as RequestUser;

    // No roles required — allow all
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!role) {
      throw new ForbiddenException(
        'Missing x-role header. Provide one of: candidate, recruiter, alumni, placement_officer, college_admin, super_admin',
      );
    }

    // super_admin bypasses all role checks — can access every protected endpoint
    if (role === 'super_admin') {
      return true;
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `Role '${role}' is not authorized. Required: ${requiredRoles.join(' | ')}`,
      );
    }

    return true;
  }
}
