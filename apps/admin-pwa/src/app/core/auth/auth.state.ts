import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from '@gracepoint/shared';
import { AdminSession } from '../models/admin-session.model';

const SESSION_KEY = 'admin_session';

function loadSession(storage: StorageService): AdminSession | null {
  try {
    const raw = storage.get(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly storage = inject(StorageService);

  private readonly _accessToken = signal<string | null>(
    localStorage.getItem('access_token')
  );
  private readonly _refreshToken = signal<string | null>(
    localStorage.getItem('refresh_token')
  );
  private readonly _currentAdmin = signal<AdminSession | null>(
    loadSession(this.storage)
  );

  readonly accessToken = this._accessToken.asReadonly();
  readonly currentAdmin = this._currentAdmin.asReadonly();
  readonly isAuthenticated = computed(() => this._accessToken() !== null);
  readonly role = computed(() => this._currentAdmin()?.role ?? null);

  setSession(accessToken: string, refreshToken: string, admin: AdminSession): void {
    this.storage.set('access_token', accessToken);
    this.storage.set('refresh_token', refreshToken);
    this.storage.set(SESSION_KEY, JSON.stringify(admin));
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
    this._currentAdmin.set(admin);
  }

  updateAccessToken(accessToken: string, refreshToken: string): void {
    this.storage.set('access_token', accessToken);
    this.storage.set('refresh_token', refreshToken);
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  getRefreshToken(): string | null {
    return this._refreshToken();
  }

  clearSession(): void {
    this.storage.remove('access_token');
    this.storage.remove('refresh_token');
    this.storage.remove(SESSION_KEY);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._currentAdmin.set(null);
  }
}