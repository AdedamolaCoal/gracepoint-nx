import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { API } from "@core/http/api.config";
import { PagedResult, ServiceEventSummary } from "@gracepoint/shared";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { ServiceAttendanceSummary } from "@core/models/attendance-summary.model";
import { WorkerAttendanceHistoryEntry } from "@core/models/worker-history.model";

@Injectable({ providedIn: "root" })
export class ReportsService {
  private readonly http = inject(HttpClient);

  exportServiceAttendance(serviceEventId: string): Observable<Blob> {
    return this.http.get(API.serviceAttendanceExport(serviceEventId), {
      responseType: "blob",
    });
  }

  getServiceEvent(page = 1, pageSize = 100): Observable<ServiceEventSummary[]> {
    return this.http.get<any>(API.serviceEvents, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as ServiceEventSummary[]) : [];
      }),
      catchError(() => of([]))
    );
  }

  getWorkers(page = 1, pageSize = 100): Observable<WorkerSummary[]> {
    return this.http.get<any>(API.workers, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as WorkerSummary[]) : [];
      }),
      catchError(() => of([]))
    );
  }

  getServiceAttendance(
    serviceEventId: string,
  ): Observable<ServiceAttendanceSummary> {
    return this.http.get<any>(API.serviceAttendance(serviceEventId)).pipe(
      map((res) => {
        if (!res) return {} as ServiceAttendanceSummary;
        return (res.data !== undefined ? res.data : res) as ServiceAttendanceSummary;
      })
    );
  }

  getWorkerHistory(
    workerId: string,
    page = 1,
    pageSize = 30,
  ): Observable<PagedResult<WorkerAttendanceHistoryEntry>> {
    const emptyPaged: PagedResult<WorkerAttendanceHistoryEntry> = {
      items: [],
      page: 1,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    if (!workerId) return of(emptyPaged);

    return this.http.get<any>(API.workerHistory(workerId), {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return emptyPaged;
        const data = res.data !== undefined ? res.data : res;
        if (data && Array.isArray(data.items)) {
          return data as PagedResult<WorkerAttendanceHistoryEntry>;
        }
        if (Array.isArray(data)) {
          return {
            items: data as WorkerAttendanceHistoryEntry[],
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
}
