import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthState } from './auth.state';

/**
 * Allows matching the /auth route block ONLY if user is NOT authenticated.
 * If authenticated, returns false so Angular Router skips /auth routes.
 */
export const guestGuard: CanMatchFn = () => {
  const authState = inject(AuthState);
  return !authState.isAuthenticated();
};

/**
 * Allows matching /set-pin ONLY if user IS authenticated AND requires PIN setup.
 * Otherwise returns false.
 */
export const pinSetupRequiredGuard: CanMatchFn = () => {
  const authState = inject(AuthState);
  return authState.isAuthenticated() && authState.requiresPinSetup();
};

/**
 * Allows matching main app tabs ONLY if user IS authenticated AND PIN setup is complete.
 * Otherwise returns false.
 */
export const pinSetupCompletedGuard: CanMatchFn = () => {
  const authState = inject(AuthState);
  return authState.isAuthenticated() && !authState.requiresPinSetup();
};
