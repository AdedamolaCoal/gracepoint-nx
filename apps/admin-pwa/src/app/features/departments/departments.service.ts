import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { API } from "@core/http/api.config";
import { Unit } from "@core/models/units.model";
import { AdminUserSummary, CreateAdminUserRequest } from "@core/models/admin-session.model";
import { PagedResult } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class DepartmentsService {
  private readonly http = inject(HttpClient);

  getUnits(page = 1, pageSize = 100): Observable<Unit[]> {
    return this.http.get<any>(API.units, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        if (data && Array.isArray(data.items)) {
          return data.items as Unit[];
        }
        if (Array.isArray(data)) {
          return data as Unit[];
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  createUnit(name: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(API.unitsCreate, {
      name,
    } satisfies Partial<Unit>);
  }

  getAdminSummary(page = 1, pageSize = 100): Observable<PagedResult<AdminUserSummary>> {
    const emptyPaged: PagedResult<AdminUserSummary> = {
      items: [],
      page: 1,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return this.http.get<any>(API.adminUsers, {
      params: { page: page.toString(), pageSize: pageSize.toString() },
    }).pipe(
      map((res) => {
        if (!res) return emptyPaged;
        const data = res.data !== undefined ? res.data : res;
        if (data && Array.isArray(data.items)) {
          return data as PagedResult<AdminUserSummary>;
        }
        if (Array.isArray(data)) {
          return {
            items: data as AdminUserSummary[],
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

  createAdminUser(
    request: CreateAdminUserRequest,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.adminUsers, request);
  }
}
