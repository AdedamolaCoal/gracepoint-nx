import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ServiceEventSummary } from "@core/models/service-event.model";
import { ServiceAttendanceSummary } from "@core/models/attendance-summary.model";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { WorkerAttendanceHistoryEntry } from "@core/models/worker-history.model";
import { ReportsService } from "./reports.service";
import { of } from "rxjs";
import { ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class ReportsStore {
  private readonly service = inject(ReportsService);

  readonly selectedServiceId = signal<string | null>(null);
  readonly selectedWorkerId = signal<string | null>(null);

  private readonly allServicesResource = rxResource({
    stream: () => this.service.getServiceEvent(),
  });

  private readonly allWorkersResource = rxResource({
    stream: () => this.service.getWorkers(),
  });

  private readonly serviceAttendanceResource = rxResource({
    params: () => this.selectedServiceId(),
    stream: ({ params: serviceId }) => {
      if (!serviceId) return of(null);
      return this.service.getServiceAttendance(serviceId);
    },
  });

  private readonly workerHistoryResource = rxResource({
    params: () => this.selectedWorkerId(),
    stream: ({ params: workerId }) => {
      if (!workerId) return of(null);
      return this.service.getWorkerHistory(workerId);
    },
  });

  readonly allServices = computed(() => ensureArray<ServiceEventSummary>(this.allServicesResource.value()));
  readonly allWorkers = computed(() => ensureArray<WorkerSummary>(this.allWorkersResource.value()));
  readonly serviceAttendance = computed(() => this.serviceAttendanceResource.value() ?? null);
  readonly workerHistory = computed(() => ensureArray<WorkerAttendanceHistoryEntry>(this.workerHistoryResource.value()));
  readonly isLoadingAttendance = computed(() => this.serviceAttendanceResource.isLoading());
  readonly isLoadingWorkerHistory = computed(() => this.workerHistoryResource.isLoading());
}
