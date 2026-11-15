import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../http/api.config';
import { AdminAuthResult } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(email: string, password: string): Observable<AdminAuthResult> {
    return this.http.post<AdminAuthResult>(API.adminLogin, { email, password });
  }

  refresh(refreshToken: string): Observable<AdminAuthResult> {
    return this.http.post<AdminAuthResult>(API.refresh, { refreshToken });
  }

  logout(): Observable<void> {
    return this.http.post<void>(API.logout, {});
  }
}