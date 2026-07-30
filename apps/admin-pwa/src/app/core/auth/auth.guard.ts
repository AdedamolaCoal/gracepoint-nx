import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthState } from './auth.state';
import { AdminRole } from '../models/admin-session.model';

export function roleGuard(allowedRoles: AdminRole[]): CanMatchFn {
  return () => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    const role = authState.role();
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/auth/login']);
  };
}

export const guestGuard: CanMatchFn = () => {
  const authState = inject(AuthState);

  if (!authState.isAuthenticated()) {
    return true;
  }

  // If already authenticated, return false to let Angular Router skip the guest route block
  return false;
};