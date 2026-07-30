import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API } from '@core/http/api.config';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { CreateServiceEventRequest } from '@core/models/service-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceEventService {
  private readonly http = inject(HttpClient);

  create(request: CreateServiceEventRequest): Observable<ServiceEventSummary> {
    return this.http.post<ServiceEventSummary>(API.serviceEvents, request);
  }

  close(id: string): Observable<void> {
    return this.http.post<void>(`${API.serviceEvents}/${id}/close`, {});
  }
}
