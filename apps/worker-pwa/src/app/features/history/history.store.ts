import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject } from "@angular/core";
import { AuthState } from "@core/auth/auth.state";
import { rxResource } from "@angular/core/rxjs-interop"
import { AttendanceHistoryEntry } from "@core/models/attendance.model";
import { API } from "@core/http/api-config";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HistoryStore {
  private readonly _http = inject(HttpClient);
  private readonly _authState = inject(AuthState);
  
  private readonly resource = rxResource({
    params: () => this._authState.currentWorker()?.id,
    stream: ({ params: workerId }) => {
      if (!workerId) {
        return of([]);
      }
      return this._http.get<AttendanceHistoryEntry[]>(API.attendanceHistory(workerId));
    }
  })

  readonly entries = computed(() => this.resource.value() ?? []);
  readonly isLoading = computed(() => this.resource.isLoading);
  readonly error = computed(() => this.resource.error());

  reload(): void {
    this.resource.reload();
  }
}