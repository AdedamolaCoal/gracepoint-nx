import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthState } from './auth.state';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const authService = inject(AuthService);

  const token = authState.accessToken();
  const authedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      const refreshToken = authState.getRefreshToken();
      if (!refreshToken) {
        authState.clearSession();
        return throwError(() => error);
      }

      return authService.refresh(refreshToken).pipe(
        switchMap((result) => {
          if (!result.data) {
            authState.clearSession();
            return throwError(() => new Error('Refresh failed'));
          }
          authState.updateAccessToken(result.data.token, result.data.refreshToken);
          const retriedReq = req.clone({ setHeaders: { Authorization: `Bearer ${result.data.token}` } });
          return next(retriedReq);
        }),
        catchError((refreshError) => {
          authState.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};