import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "@core/http/api.config";
import { ServiceEventSummary } from "@gracepoint/shared";
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

  getServiceEvent(): Observable<ServiceEventSummary[]> {
    return this.http.get<ServiceEventSummary[]>(API.serviceEvents);
  }

  getWorkers(): Observable<WorkerSummary[]> {
    return this.http.get<WorkerSummary[]>(API.workers);
  }

  getServiceAttendance(
    serviceEventId: string,
  ): Observable<ServiceAttendanceSummary> {
    return this.http.get<ServiceAttendanceSummary>(
      API.serviceAttendance(serviceEventId),
    );
  }

  getWorkerHistory(
    workerId: string,
  ): Observable<WorkerAttendanceHistoryEntry[]> {
    return this.http.get<WorkerAttendanceHistoryEntry[]>(
      API.workerHistory(workerId),
    );
  }
}
