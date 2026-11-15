import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { HomeService } from './home.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeStore {
  private readonly homeService = inject(HomeService);

  private readonly pollTick = toSignal(interval(60_000), { initialValue: 0 });

  private readonly resource = rxResource({
    params: () => this.pollTick(),
    stream: () => this.homeService.getCurrentServiceEvents(),
  });

  readonly eventsList = computed<ServiceEventSummary[]>(() => this.resource.value() ?? []);
  readonly isLoading = computed(() => this.resource.isLoading());

  readonly selectedEventId = signal<string | null>(null);

  readonly activeEvent = computed(() => {
    const list = this.eventsList();
    if (list.length === 0) return null;
    const selectedId = this.selectedEventId();
    if (selectedId) {
      const found = list.find((e) => e.id === selectedId);
      if (found) return found;
    }
    return list[0];
  });

  readonly hasOpenService = computed(() => {
    return this.eventsList().some((e) => e.status === 'Open');
  });

  selectEvent(id: string): void {
    this.selectedEventId.set(id);
  }

  refreshNow(): void {
    this.resource.reload();
  }
}
