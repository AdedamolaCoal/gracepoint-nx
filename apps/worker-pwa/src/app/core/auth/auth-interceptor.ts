import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from './auth.state';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthState);
  const authService = inject(AuthService);

  const token = authState.access();
  const authedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
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
        switchMap((res) => {
          if (!res.data) {
            authState.clearSession();
            return throwError(() => new Error('Refresh failed'));
          }
          authState.updateAccessToken(res.data.token, res.data.refreshToken);
          const retriedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${res.data.token}` },
          });
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
