import { UserRole } from '@prisma/client';

/** Roles that map to "admin" in the panel UI */
export const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export const RESELLER_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RESELLER];

export function isAdmin(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isReseller(role: UserRole): boolean {
  return RESELLER_ROLES.includes(role);
}

export function hasAnyRole(userRole: UserRole, required: UserRole[]): boolean {
  if (required.includes(userRole)) return true;
  if (userRole === UserRole.SUPER_ADMIN) {
    return required.some((r) =>
      [UserRole.ADMIN, UserRole.RESELLER, UserRole.USER].includes(r),
    );
  }
  if (userRole === UserRole.ADMIN) {
    return required.some((r) => [UserRole.RESELLER, UserRole.USER].includes(r));
  }
  return false;
}
