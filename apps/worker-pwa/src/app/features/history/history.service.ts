import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AttendanceHistoryEntry } from "@core/models/attendance.model";
import { API } from "@core/http/api-config";
import { PagedResult } from "@gracepoint/shared";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HistoryService {
  private readonly http = inject(HttpClient);

  getAttendanceHistory(workerId: string, page = 1, pageSize = 30): Observable<PagedResult<AttendanceHistoryEntry>> {
    const emptyPaged: PagedResult<AttendanceHistoryEntry> = {
      items: [],
      page: 1,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    if (!workerId) {
      return of(emptyPaged);
    }

    return this.http
      .get<any>(API.attendanceHistory(workerId), {
        params: { page: page.toString(), pageSize: pageSize.toString() },
      })
      .pipe(
        map((res) => {
          if (!res) return emptyPaged;
          const data = res.data !== undefined ? res.data : res;
          if (data && Array.isArray(data.items)) {
            return data as PagedResult<AttendanceHistoryEntry>;
          }
          if (Array.isArray(data)) {
            return {
              items: data as AttendanceHistoryEntry[],
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
