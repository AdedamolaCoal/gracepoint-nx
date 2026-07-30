import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { API } from '@core/http/api-config';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeStore {
  private readonly _http = inject(HttpClient);

  private readonly pollTick = toSignal(interval(60_000), { initialValue: 0 });

  private readonly resource = rxResource({
    params: () => this.pollTick(),
    stream: () => this._http.get<ServiceEventSummary | null>(API.currentServiceEvent),
  });

  readonly currentService = computed(() => this.resource.value() ?? null);
  readonly isLoading = computed(() => this.resource.isLoading());
  readonly hasOpenService = computed(() => this.currentService()?.status === 'Open')

  refreshNow(): void {
    this.resource.reload();
  }
}
