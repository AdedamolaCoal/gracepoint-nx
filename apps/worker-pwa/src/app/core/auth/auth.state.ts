import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '@gracepoint/shared';
import { WorkerSession } from '@core/models/worker.model';

const SESSION_KEY = 'worker_session';

function loadSession(storage: StorageService): WorkerSession | null {
  try {
    const raw = storage.get(SESSION_KEY);
    return raw ? (JSON.parse(raw) as WorkerSession) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthState {
  private readonly storage = inject(StorageService);

  private readonly _access = signal<string | null>(
    localStorage.getItem('access_token')
  );

  private readonly _refresh = signal<string | null>(
    localStorage.getItem('refresh_token')
  );

  private readonly _currentWorker = signal<WorkerSession | null>(
    loadSession(this.storage)
  );

  readonly access = this._access.asReadonly();
  readonly currentWorker = this._currentWorker.asReadonly();
  readonly isAuthenticated = computed(() => this._access() !== null);
  readonly requiresPinSetup = computed(() => this._currentWorker()?.requiresPinSetup ?? false);

  setSession(accessToken: string, refreshToken: string, worker: WorkerSession) {
    this.storage.set('access_token', accessToken);
    this.storage.set('refresh_token', refreshToken);
    this.storage.set(SESSION_KEY, JSON.stringify(worker));
    this._access.set(accessToken);
    this._refresh.set(refreshToken);
    this._currentWorker.set(worker);
  }

  setRequiresPinSetup(requires: boolean): void {
    const current = this._currentWorker();
    if (current) {
      const updated: WorkerSession = { ...current, requiresPinSetup: requires };
      this.storage.set(SESSION_KEY, JSON.stringify(updated));
      this._currentWorker.set(updated);
    }
  }

  updateAccessToken(accessToken: string, refreshToken: string): void {
    this.storage.set('access_token', accessToken);
    this.storage.set('refresh_token', refreshToken);
    this._access.set(accessToken);
    this._refresh.set(refreshToken);
  }

  getRefreshToken(): string | null {
    return this._refresh();
  }

  clearSession(): void {
    this.storage.remove('access_token');
    this.storage.remove('refresh_token');
    this.storage.remove(SESSION_KEY);
    this._access.set(null);
    this._refresh.set(null);
    this._currentWorker.set(null);
  }
}
