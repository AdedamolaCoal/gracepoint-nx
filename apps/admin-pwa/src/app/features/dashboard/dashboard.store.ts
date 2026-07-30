import { Injectable, inject, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { API } from '@core/http/api.config';
import { ServiceAttendanceSummary } from '@core/models/attendance-summary.model';
import { WorkerSummary } from '@core/models/worker-summary.model';
import { of } from 'rxjs';
import { ensureArray } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly http = inject(HttpClient);

  private readonly currentServiceResource = rxResource({
    stream: () => this.http.get<ServiceEventSummary | null>(API.currentServiceEvent),
  });

  private readonly attendanceResource = rxResource({
    params: () => this.currentServiceResource.value()?.id,
    stream: ({ params: serviceId }) => {
      if (!serviceId) return of(null);
      return this.http.get<ServiceAttendanceSummary>(API.serviceAttendance(serviceId));
    },
  });

  private readonly pendingWorkersResource = rxResource({
    stream: () => this.http.get<WorkerSummary[]>(API.pendingWorkers),
  });

  readonly currentService = computed(() => this.currentServiceResource.value() ?? null);
  readonly attendanceSummary = computed(() => this.attendanceResource.value() ?? null);
  readonly pendingWorkers = computed(() => ensureArray<WorkerSummary>(this.pendingWorkersResource.value()));
  readonly isLoading = computed(() => this.currentServiceResource.isLoading());

  refreshAll(): void {
    this.currentServiceResource.reload();
    this.pendingWorkersResource.reload();
  }
}