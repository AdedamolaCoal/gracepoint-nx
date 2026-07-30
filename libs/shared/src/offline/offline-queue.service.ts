import { Injectable, Signal } from '@angular/core';
import { OfflineDatabase, PendingClockIn } from './offline.db';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { ClockInRequest } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class OfflineQueueService {
  private readonly _db = new OfflineDatabase();

  readonly pendingCount: Signal<number | undefined> = toSignal(
    from(liveQuery(() => this._db.pendingClockIn.count())),
    { initialValue: 0 }
  );


  async enqueue(request: ClockInRequest): Promise<void> {
    await this._db.pendingClockIn.add({
      ...request,
      createdAt: new Date().toISOString(),
      attempts: 0,
    });
  }

  async getAll(): Promise<PendingClockIn[]> {
    return this._db.pendingClockIn.toArray();
  }

  async markAttempts(id: number, error: string): Promise<void> {
    const item = await this._db.pendingClockIn.get(id);
    if (item) {
      await this._db.pendingClockIn.update(id, {
        attempts: item.attempts + 1,
        lastError: error,
      });
    }
  }

  async remove(id: number): Promise<void> {
    await this._db.pendingClockIn.delete(id);
  }
}
