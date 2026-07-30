import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API } from '@core/http/api-config';
import { Observable } from 'rxjs';
import { WorkerAuthResult } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);

  login(phoneNumber: string, pin: string): Observable<WorkerAuthResult> {
    return this._http.post<WorkerAuthResult>(API.workerLogin, { phoneNumber, pin });
  }

  refresh(refreshToken: string): Observable<WorkerAuthResult> {
    return this._http.post<WorkerAuthResult>(API.refresh, { refreshToken });
  }

  logout(): Observable<void> {
    return this._http.post<void>(API.logout, {});
  }
}
