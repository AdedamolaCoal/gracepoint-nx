import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API } from "@core/http/api.config";
import { Unit } from "@core/models/units.model";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { PagedResult } from "@gracepoint/shared";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface WorkerImportResponse {
  imported: number;
  skipped: number;
  errors: string[];
}

@Injectable({
  providedIn: "root",
})
export class WorkersService {
  private readonly _http = inject(HttpClient);

  getWorkerSummary(page = 1, pageSize = 30): Observable<PagedResult<WorkerSummary>> {
    const emptyPaged: PagedResult<WorkerSummary> = {
      items: [],
      page: 1,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return this._http.get<any>(API.workers, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
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
      })
    );
  }

  getUnits(page = 1, pageSize = 100): Observable<Unit[]> {
    return this._http.get<any>(API.units, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as Unit[]) : [];
      })
    );
  }

  importWorkers(file: File): Observable<WorkerImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<any>(API.workersImport, formData).pipe(
      map((res) => {
        if (!res) return { imported: 0, skipped: 0, errors: [] };
        const data = res.data !== undefined ? res.data : res;
        return {
          imported: Number(data?.imported ?? 0),
          skipped: Number(data?.skipped ?? 0),
          errors: Array.isArray(data?.errors) ? data.errors : [],
        };
      })
    );
  }

  downloadImportTemplate(): Observable<Blob> {
    return this._http.get(API.workersImportTemplate, { responseType: 'blob' });
  }
}
