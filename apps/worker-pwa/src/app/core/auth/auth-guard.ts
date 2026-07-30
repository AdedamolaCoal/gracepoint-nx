import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthState } from './auth.state';

export const authGuard: CanMatchFn = (route, state) => {
  const authtState = inject(AuthState);
  const router = inject(Router);

  if (authtState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanMatchFn = (route, state) => {
  const authtState = inject(AuthState);
  const router = inject(Router);

  if (!authtState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
