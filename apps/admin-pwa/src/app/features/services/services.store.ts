import { Injectable, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ServicesService } from './services.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { PagedResult } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class ServicesStore {
  private readonly service = inject(ServicesService);

  private readonly refetchTrigger = signal(0);
  private readonly _page = signal(1);
  private readonly _pageSize = signal(30);

  private readonly resource = rxResource({
    params: () => ({ page: this._page(), pageSize: this._pageSize(), trigger: this.refetchTrigger() }),
    stream: ({ params }) => this.service.getServiceSummary(params.page, params.pageSize),
  });

  readonly pagedResult = computed(() => this.resource.value() as PagedResult<ServiceEventSummary> | undefined);
  readonly services = computed(() => this.pagedResult()?.items ?? []);
  readonly currentService = computed(() => this.services().find((s) => s.status === 'Open') ?? null);
  readonly isLoading = computed(() => this.resource.isLoading());

  readonly page = computed(() => this.pagedResult()?.page ?? this._page());
  readonly pageSize = computed(() => this.pagedResult()?.pageSize ?? this._pageSize());
  readonly totalPages = computed(() => this.pagedResult()?.totalPages ?? 1);
  readonly totalCount = computed(() => this.pagedResult()?.totalCount ?? 0);
  readonly hasNextPage = computed(() => this.pagedResult()?.hasNextPage ?? false);
  readonly hasPreviousPage = computed(() => this.pagedResult()?.hasPreviousPage ?? false);

  setPage(page: number): void {
    this._page.set(page);
  }

  resetPage(): void {
    this._page.set(1);
  }

  refresh(): void {
    this.refetchTrigger.update((n) => n + 1);
  }
}