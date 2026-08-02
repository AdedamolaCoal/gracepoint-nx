import { Injectable, computed, inject, signal } from "@angular/core";
import { AuthState } from "@core/auth/auth.state";
import { HistoryService } from "./history.service";
import { AttendanceHistoryEntry } from "@core/models/attendance.model";

@Injectable({
  providedIn: "root"
})
export class HistoryStore {
  private readonly historyService = inject(HistoryService);
  private readonly authState = inject(AuthState);

  private readonly _page = signal(1);
  private readonly _pageSize = signal(30);
  private readonly _entries = signal<AttendanceHistoryEntry[]>([]);
  private readonly _hasNextPage = signal(true);
  private readonly _isLoading = signal(false);
  private readonly _isInitialLoading = signal(true);

  readonly entries = computed(() => this._entries());
  readonly isLoading = computed(() => this._isLoading());
  readonly isInitialLoading = computed(() => this._isInitialLoading());
  readonly hasNextPage = computed(() => this._hasNextPage());
  readonly page = computed(() => this._page());

  constructor() {
    this.reload();
  }

  loadMore(doneCallback?: () => void): void {
    if (!this._hasNextPage() && this._page() > 1) {
      doneCallback?.();
      return;
    }

    const workerId = this.authState.currentWorker()?.id;
    if (!workerId) {
      this._isInitialLoading.set(false);
      doneCallback?.();
      return;
    }

    this._isLoading.set(true);

    this.historyService.getAttendanceHistory(workerId, this._page(), this._pageSize()).subscribe({
      next: (res) => {
        this._isLoading.set(false);
        this._isInitialLoading.set(false);

        if (res) {
          this._entries.update((old) => [...old, ...res.items]);
          this._hasNextPage.set(res.hasNextPage);
          this._page.set(res.page + 1);
        }
        doneCallback?.();
      },
      error: () => {
        this._isLoading.set(false);
        this._isInitialLoading.set(false);
        doneCallback?.();
      },
    });
  }

  reload(doneCallback?: () => void): void {
    this._page.set(1);
    this._entries.set([]);
    this._hasNextPage.set(true);
    this._isInitialLoading.set(true);
    this.loadMore(doneCallback);
  }
}