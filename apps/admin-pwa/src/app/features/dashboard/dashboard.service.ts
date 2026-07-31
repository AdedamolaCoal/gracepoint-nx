import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '@core/http/api.config';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { ServiceAttendanceSummary } from '@core/models/attendance-summary.model';
import { WorkerSummary } from '@core/models/worker-summary.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getCurrentServiceEvent(): Observable<ServiceEventSummary | null> {
    return this.http.get<ServiceEventSummary | null>(API.currentServiceEvent);
  }

  getServiceAttendance(serviceId: string): Observable<ServiceAttendanceSummary> {
    return this.http.get<ServiceAttendanceSummary>(API.serviceAttendance(serviceId));
  }

  getPendingWorkers(): Observable<WorkerSummary[]> {
    return this.http.get<WorkerSummary[]>(API.pendingWorkers);
  }

  getAllWorkers(): Observable<WorkerSummary[]> {
    return this.http.get<WorkerSummary[]>(API.workers);
  }

  getServiceEvents(): Observable<ServiceEventSummary[]> {
    return this.http.get<ServiceEventSummary[]>(API.serviceEvents);
  }

  approveWorker(workerId: string): Observable<void> {
    return this.http.post<void>(`${API.workers}/${workerId}/approve`, {});
  }
}
