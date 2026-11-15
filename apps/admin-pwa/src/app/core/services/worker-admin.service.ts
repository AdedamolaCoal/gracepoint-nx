import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from "../http/api.config";

export interface CreateWorkerRequest {
  fullName: string;
  phoneNumber: string;
  unitId: string;
}

@Injectable({ providedIn: "root" })
export class WorkerAdminService {
  private readonly http = inject(HttpClient);

  create(request: CreateWorkerRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(API.workers, request);
  }

  approve(workerId: string): Observable<void> {
    return this.http.post<void>(`${API.workers}/${workerId}/approve`, {});
  }

  deactivate(workerId: string): Observable<void> {
    return this.http.post<void>(`${API.workers}/${workerId}/deactivate`, {});
  }

  reactivate(workerId: string): Observable<void> {
    return this.http.post<void>(`${API.workers}/${workerId}/reactivate`, {});
  }
}
