import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API } from "@core/http/api-config";
import { RegisterWorkerRequest, RegisterWorkerResult } from "@core/models/registration.model";
import { Unit } from "@core/models/unit.model";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  private readonly _http = inject(HttpClient);

  getUnits(): Observable<Unit[]> {
    return this._http
      .get<any>(API.units, {
        params: { page: '1', pageSize: '100' },
      })
      .pipe(
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

  register(request: RegisterWorkerRequest): Observable<RegisterWorkerResult> {
    return this._http.post<ApiResponse<RegisterWorkerResult> | RegisterWorkerResult>(API.register, request).pipe(
      map((res: any) => {
        if (res && typeof res === 'object') {
          if ('success' in res) {
            return {
              success: Boolean(res.success),
              message: res.message || (res.success ? 'Success' : 'Registration failed'),
              wasClaim: Boolean(res.data?.wasClaim ?? false),
            };
          }
          return res as RegisterWorkerResult;
        }
        return { success: false, message: 'Registration failed', wasClaim: false };
      })
    );
  }
}
