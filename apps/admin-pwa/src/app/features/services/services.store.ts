import { Injectable, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ServicesService } from './services.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { ensureArray } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class ServicesStore {
  private readonly service = inject(ServicesService);

  private readonly refetchTrigger = signal(0);

  private readonly resource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this.service.getServiceSummary(),
  });

  readonly services = computed(() => ensureArray<ServiceEventSummary>(this.resource.value()));
  readonly currentService = computed(() => this.services().find((s) => s.status === 'Open') ?? null);
  readonly isLoading = computed(() => this.resource.isLoading());

  refresh(): void {
    this.refetchTrigger.update((n) => n + 1);
  }
}