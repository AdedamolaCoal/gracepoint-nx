import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API } from '@core/http/api-config';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function normalizeStatus(status: number | string): 'Scheduled' | 'Open' | 'Closed' {
  if (status === 1 || status === '1' || status === 'Open') return 'Open';
  if (status === 2 || status === '2' || status === 'Closed') return 'Closed';
  return 'Scheduled';
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly http = inject(HttpClient);

  getCurrentServiceEvents(): Observable<ServiceEventSummary[]> {
    return this.http.get<ApiResponse<any> | any>(API.currentServiceEvent).pipe(
      map((res) => {
        if (!res) return [];
        const rawData = res.data !== undefined ? res.data : res;
        if (!rawData) return [];
        const items = Array.isArray(rawData) ? rawData : [rawData];
        return items.map((item) => ({
          ...item,
          status: normalizeStatus(item.status),
        })) as ServiceEventSummary[];
      }),
      catchError(() => of([]))
    );
  }
}
