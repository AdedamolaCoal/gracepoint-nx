import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ServiceEventSummary } from "@core/models/service-event.model";
import { ServiceAttendanceSummary } from "@core/models/attendance-summary.model";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { WorkerAttendanceHistoryEntry } from "@core/models/worker-history.model";
import { ReportsService } from "./reports.service";
import { of } from "rxjs";
import { PagedResult, ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class ReportsStore {
  private readonly service = inject(ReportsService);

  readonly selectedServiceId = signal<string | null>(null);
  readonly selectedWorkerId = signal<string | null>(null);

  readonly workerHistoryPage = signal(1);
  readonly workerHistoryPageSize = signal(30);

  private readonly allServicesResource = rxResource({
    stream: () => this.service.getServiceEvent(1, 100),
  });

  private readonly allWorkersResource = rxResource({
    stream: () => this.service.getWorkers(1, 100),
  });

  private readonly serviceAttendanceResource = rxResource({
    params: () => this.selectedServiceId(),
    stream: ({ params: serviceId }) => {
      if (!serviceId) return of(null);
      return this.service.getServiceAttendance(serviceId);
    },
  });

  private readonly workerHistoryResource = rxResource({
    params: () => ({ workerId: this.selectedWorkerId(), page: this.workerHistoryPage(), pageSize: this.workerHistoryPageSize() }),
    stream: ({ params }) => {
      if (!params.workerId) return of(null);
      return this.service.getWorkerHistory(params.workerId, params.page, params.pageSize);
    },
  });

  readonly allServices = computed(() => ensureArray<ServiceEventSummary>(this.allServicesResource.value()));
  readonly allWorkers = computed(() => ensureArray<WorkerSummary>(this.allWorkersResource.value()));
  readonly serviceAttendance = computed(() => this.serviceAttendanceResource.value() ?? null);

  readonly workerHistoryPaged = computed(() => this.workerHistoryResource.value() as PagedResult<WorkerAttendanceHistoryEntry> | undefined);
  readonly workerHistory = computed(() => this.workerHistoryPaged()?.items ?? []);
  readonly workerHistoryTotalPages = computed(() => this.workerHistoryPaged()?.totalPages ?? 1);
  readonly workerHistoryTotalCount = computed(() => this.workerHistoryPaged()?.totalCount ?? 0);
  readonly workerHistoryHasNextPage = computed(() => this.workerHistoryPaged()?.hasNextPage ?? false);
  readonly workerHistoryHasPreviousPage = computed(() => this.workerHistoryPaged()?.hasPreviousPage ?? false);

  readonly isLoadingAttendance = computed(() => this.serviceAttendanceResource.isLoading());
  readonly isLoadingWorkerHistory = computed(() => this.workerHistoryResource.isLoading());

  setWorkerHistoryPage(page: number): void {
    this.workerHistoryPage.set(page);
  }

  setSelectedWorker(workerId: string | null): void {
    this.workerHistoryPage.set(1);
    this.selectedWorkerId.set(workerId);
  }
}
