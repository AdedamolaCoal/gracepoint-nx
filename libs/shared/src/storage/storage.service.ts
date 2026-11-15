import { Injectable } from '@angular/core';

/**
 * Shared thin wrapper around localStorage.
 * Both admin-pwa and worker-pwa use this instead of calling localStorage directly.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
