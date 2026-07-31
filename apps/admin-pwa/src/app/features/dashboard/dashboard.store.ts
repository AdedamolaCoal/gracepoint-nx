import { Injectable, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardService } from './dashboard.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { ServiceAttendanceSummary } from '@core/models/attendance-summary.model';
import { WorkerSummary } from '@core/models/worker-summary.model';
import { of } from 'rxjs';
import { ensureArray } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly dashboardService = inject(DashboardService);

  private readonly refetchTrigger = signal(0);
  readonly isActionSubmitting = signal(false);

  private readonly currentServiceResource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this.dashboardService.getCurrentServiceEvent(),
  });

  private readonly attendanceResource = rxResource({
    params: () => ({
      serviceId: this.currentServiceResource.value()?.id,
      trigger: this.refetchTrigger(),
    }),
    stream: ({ params }) => {
      if (!params.serviceId) return of(null);
      return this.dashboardService.getServiceAttendance(params.serviceId);
    },
  });

  private readonly pendingWorkersResource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this.dashboardService.getPendingWorkers(),
  });

  private readonly allWorkersResource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this.dashboardService.getAllWorkers(),
  });

  private readonly allServicesResource = rxResource({
    params: () => this.refetchTrigger(),
    stream: () => this.dashboardService.getServiceEvents(),
  });

  readonly currentService = computed(() => this.currentServiceResource.value() ?? null);
  readonly attendanceSummary = computed(() => this.attendanceResource.value() ?? null);
  readonly pendingWorkers = computed(() => ensureArray<WorkerSummary>(this.pendingWorkersResource.value()));
  readonly allWorkers = computed(() => ensureArray<WorkerSummary>(this.allWorkersResource.value()));
  readonly allServices = computed(() => ensureArray<ServiceEventSummary>(this.allServicesResource.value()));

  readonly totalWorkersCount = computed(() => this.allWorkers().length);
  readonly activeWorkersCount = computed(() => this.allWorkers().filter((w) => w.isActive && w.isApproved).length);
  readonly totalServicesCount = computed(() => this.allServices().length);

  readonly recentWorkers = computed(() => this.allWorkers().slice(0, 8));

  readonly isLoading = computed(
    () =>
      this.currentServiceResource.isLoading() ||
      this.allWorkersResource.isLoading() ||
      this.pendingWorkersResource.isLoading()
  );

  refreshAll(): void {
    this.refetchTrigger.update((n) => n + 1);
  }

  approveWorker(workerId: string): void {
    this.isActionSubmitting.set(true);
    this.dashboardService.approveWorker(workerId).subscribe({
      next: () => {
        this.isActionSubmitting.set(false);
        this.refreshAll();
      },
      error: () => {
        this.isActionSubmitting.set(false);
      },
    });
  }
}