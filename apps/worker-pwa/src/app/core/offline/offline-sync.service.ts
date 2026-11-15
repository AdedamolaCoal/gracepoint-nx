import { Injectable, inject, signal } from '@angular/core';
import { AttendanceService } from '@core/services/attendance.service';
import { OfflineQueueService } from './offline-queue.service';
import { App } from '@capacitor/app';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfflineSyncService {
  private readonly _attendanceService = inject(AttendanceService);
  private readonly _queue = inject(OfflineQueueService);
  private readonly isSyncing = signal<boolean>(false);

  constructor() {
    window.addEventListener('online', () => this.syncNow());
    App.addListener('resume', () => this.syncNow());
    setInterval(() => this.syncNow(), 30_000);

    this.syncNow();
  }

  async syncNow(): Promise<void> {
    if (this.isSyncing() || !navigator.onLine) return;
    this.isSyncing.set(true);
    try {
      const pending = await this._queue.getAll();

      for (const item of pending) {
        try {
          const result = await firstValueFrom(this._attendanceService.clockIn(item));

          await this._queue.remove(item.id!);

          if (!result.success) {
            console.warn(`Queued clock-in rejected: ${result.message}`);
          }
        } catch {
          if (item.id) await this._queue.markAttempts(item.id, 'Network error during sync');
          break;
        }
      }
    } finally {
      this.isSyncing.set(false);
    }
  }
}
