import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map, of } from "rxjs";
import { API } from "@core/http/api.config";
import { AdminUserSummary, CreateAdminUserRequest } from "@core/models/admin-session.model";
import { Unit } from "@core/models/units.model";

@Injectable({ providedIn: "root" })
export class AdminUsersService {
  private readonly http = inject(HttpClient);

  getAdminSummary(): Observable<AdminUserSummary[]> {
    return this.http.get<any>(API.adminUsers, { params: { page: '1', pageSize: '100' } }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as AdminUserSummary[]) : [];
      }),
      catchError(() => of([]))
    );
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<any>(API.units, { params: { page: '1', pageSize: '100' } }).pipe(
      map((res) => {
        if (!res) return [];
        const data = res.data !== undefined ? res.data : res;
        const items = data && Array.isArray(data.items) ? data.items : data;
        return Array.isArray(items) ? (items as Unit[]) : [];
      }),
      catchError(() => of([]))
    );
  }

  createAdminUser(
    request: CreateAdminUserRequest,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.adminUsers, request);
  }
}
