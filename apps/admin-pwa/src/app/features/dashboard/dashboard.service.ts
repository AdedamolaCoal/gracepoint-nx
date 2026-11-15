import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { API } from '@core/http/api.config';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { ServiceAttendanceSummary } from '@core/models/attendance-summary.model';
import { WorkerSummary } from '@core/models/worker-summary.model';
import { PagedResult } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getCurrentServiceEvent(): Observable<ServiceEventSummary | null> {
    return this.http.get<any>(API.currentServiceEvent).pipe(
      map((res) => {
        if (!res) return null;
        return (res.data !== undefined ? res.data : res) as ServiceEventSummary;
      }),
      catchError(() => of(null))
    );
  }

  getServiceAttendance(serviceId: string): Observable<ServiceAttendanceSummary> {
    return this.http.get<any>(API.serviceAttendance(serviceId)).pipe(
      map((res) => {
        if (!res) return {} as ServiceAttendanceSummary;
        return (res.data !== undefined ? res.data : res) as ServiceAttendanceSummary;
      }),
      catchError(() => of({} as ServiceAttendanceSummary))
    );
  }

  getPendingWorkers(): Observable<WorkerSummary[]> {
    return this.http.get<any>(API.pendingWorkers).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as WorkerSummary[]) : [];
      }),
      catchError(() => of([]))
    );
  }

  getAllWorkers(): Observable<PagedResult<WorkerSummary>> {
    const emptyPaged: PagedResult<WorkerSummary> = {
      items: [],
      page: 1,
      pageSize: 100,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return this.http.get<any>(API.workers, { params: { page: '1', pageSize: '100' } }).pipe(
      map((res) => {
        if (!res) return emptyPaged;
        const data = res.data !== undefined ? res.data : res;
        if (data && Array.isArray(data.items)) {
          return data as PagedResult<WorkerSummary>;
        }
        if (Array.isArray(data)) {
          return {
            items: data as WorkerSummary[],
            page: 1,
            pageSize: data.length,
            totalCount: data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
        return emptyPaged;
      }),
      catchError(() => of(emptyPaged))
    );
  }

  getServiceEvents(): Observable<PagedResult<ServiceEventSummary>> {
    const emptyPaged: PagedResult<ServiceEventSummary> = {
      items: [],
      page: 1,
      pageSize: 100,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return this.http.get<any>(API.serviceEvents, { params: { page: '1', pageSize: '100' } }).pipe(
      map((res) => {
        if (!res) return emptyPaged;
        const data = res.data !== undefined ? res.data : res;
        if (data && Array.isArray(data.items)) {
          return data as PagedResult<ServiceEventSummary>;
        }
        if (Array.isArray(data)) {
          return {
            items: data as ServiceEventSummary[],
            page: 1,
            pageSize: data.length,
            totalCount: data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          };
        }
        return emptyPaged;
      }),
      catchError(() => of(emptyPaged))
    );
  }

  approveWorker(workerId: string): Observable<void> {
    return this.http.post<void>(`${API.workers}/${workerId}/approve`, {});
  }

  getRegistrationInviteActive(): Observable<any> {
    return this.http.get<{ token: string }>(API.registrationInviteActive).pipe(
      catchError(() => of(null))
    );
  }

  generateInvite(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(API.registrationInviteGenerate, {});
  }

  revokeInvite(): Observable<void> {
    return this.http.post<void>(API.registrationInviteRevoke, {});
  }
}
