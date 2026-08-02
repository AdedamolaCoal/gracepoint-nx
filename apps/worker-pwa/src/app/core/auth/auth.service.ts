import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API } from '@core/http/api-config';
import { Observable } from 'rxjs';
import { WorkerAuthResult } from './auth.model';
import { RegisterWorkerRequest, RegisterWorkerResult } from '@core/models/registration.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);

  register(request: RegisterWorkerRequest): Observable<RegisterWorkerResult> {
    return this._http.post<RegisterWorkerResult>(API.register, request);
  }

  login(phoneNumber: string, pin?: string | null): Observable<WorkerAuthResult> {
    return this._http.post<WorkerAuthResult>(API.workerLogin, {
      phoneNumber,
      pin: pin?.trim() ? pin.trim() : null,
    });
  }

  setPin(newPin: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(API.setPin, {
      newPin,
    });
  }

  changePin(currentPin: string, newPin: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(API.changePin, {
      currentPin,
      newPin,
    });
  }

  registerDevice(token: string, platform: 'web' | 'android' | 'ios' = 'web'): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(API.registerDevice, {
      token,
      platform,
    });
  }

  unregisterDevice(token: string): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(API.unregisterDevice(token));
  }

  refresh(refreshToken: string): Observable<WorkerAuthResult> {
    return this._http.post<WorkerAuthResult>(API.refresh, { refreshToken });
  }

  logout(): Observable<void> {
    return this._http.post<void>(API.logout, {});
  }
}
