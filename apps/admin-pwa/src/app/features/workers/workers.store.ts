import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { WorkersService } from "./workers.service";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { Unit } from "@core/models/units.model";
import { ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class WorkersStore {
  private readonly _service = inject(WorkersService);
  private readonly refetchTrigger = signal(0);

  private readonly workersResource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this._service.getWorkerSummary(),
  });

  private readonly unitsResource = rxResource({
    stream: () => this._service.getUnits(),
  });

  readonly allWorkers = computed(() => ensureArray<WorkerSummary>(this.workersResource.value()));
  readonly units = computed(() => ensureArray<Unit>(this.unitsResource.value()));
  readonly isLoading = computed(() => this.workersResource.isLoading());

  readonly sortedWorkers = computed(() =>
    [...this.allWorkers()].sort((a, b) => {
      if (a.isApproved !== b.isApproved) return a.isApproved ? 1 : -1;
      return (a.fullName || '').localeCompare(b.fullName || '');
    }),
  );

  readonly pendingCount = computed(
    () => this.allWorkers().filter((w) => !w.isApproved).length,
  );

  refresh(): void {
    this.refetchTrigger.update((n) => n + 1);
  }
}
