import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { WorkersService } from "./workers.service";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { Unit } from "@core/models/units.model";
import { PagedResult, ensureArray } from "@gracepoint/shared";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class WorkersStore {
  private readonly _service = inject(WorkersService);
  private readonly refetchTrigger = signal(0);

  private readonly _page = signal(1);
  private readonly _pageSize = signal(30);

  private readonly workersResource = rxResource({
    params: () => ({ page: this._page(), pageSize: this._pageSize(), trigger: this.refetchTrigger() }),
    stream: ({ params }) => this._service.getWorkerSummary(params.page, params.pageSize),
  });

  private readonly unitsResource = rxResource({
    stream: () => this._service.getUnits(1, 100),
  });

  readonly pagedResult = computed(() => this.workersResource.value() as PagedResult<WorkerSummary> | undefined);
  readonly allWorkers = computed(() => this.pagedResult()?.items ?? []);
  readonly units = computed(() => ensureArray<Unit>(this.unitsResource.value()));
  readonly isLoading = computed(() => this.workersResource.isLoading());

  readonly page = computed(() => this.pagedResult()?.page ?? this._page());
  readonly pageSize = computed(() => this.pagedResult()?.pageSize ?? this._pageSize());
  readonly totalPages = computed(() => this.pagedResult()?.totalPages ?? 1);
  readonly totalCount = computed(() => this.pagedResult()?.totalCount ?? 0);
  readonly hasNextPage = computed(() => this.pagedResult()?.hasNextPage ?? false);
  readonly hasPreviousPage = computed(() => this.pagedResult()?.hasPreviousPage ?? false);

  readonly sortedWorkers = computed(() =>
    [...this.allWorkers()].sort((a, b) => {
      if (a.isApproved !== b.isApproved) return a.isApproved ? 1 : -1;
      return (a.fullName || '').localeCompare(b.fullName || '');
    }),
  );

  readonly pendingCount = computed(
    () => this.allWorkers().filter((w) => !w.isApproved).length,
  );

  setPage(page: number): void {
    this._page.set(page);
  }

  resetPage(): void {
    this._page.set(1);
  }

  refresh(): void {
    this.refetchTrigger.update((n) => n + 1);
  }

  downloadTemplate(): Observable<Blob> {
    return this._service.downloadImportTemplate();
  }
}
