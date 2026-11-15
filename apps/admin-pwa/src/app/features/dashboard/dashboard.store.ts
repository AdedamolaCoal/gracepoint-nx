import { Injectable, inject, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardService } from './dashboard.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { ServiceAttendanceSummary } from '@core/models/attendance-summary.model';
import { WorkerSummary } from '@core/models/worker-summary.model';
import { of } from 'rxjs';
import { PagedResult, ensureArray } from '@gracepoint/shared';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly dashboardService = inject(DashboardService);

  private readonly refetchTrigger = signal(0);
  private readonly inviteRefetch = signal(0);
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

  private readonly activeInviteResource = rxResource({
    params: () => this.inviteRefetch(),
    stream: () => this.dashboardService.getRegistrationInviteActive(),
  });

  readonly currentService = computed(() => this.currentServiceResource.value() ?? null);
  readonly attendanceSummary = computed(() => this.attendanceResource.value() ?? null);
  readonly pendingWorkers = computed(() => ensureArray<WorkerSummary>(this.pendingWorkersResource.value()));

  readonly allWorkersPaged = computed(() => this.allWorkersResource.value() as PagedResult<WorkerSummary> | undefined);
  readonly allWorkers = computed(() => this.allWorkersPaged()?.items ?? []);

  readonly allServicesPaged = computed(() => this.allServicesResource.value() as PagedResult<ServiceEventSummary> | undefined);
  readonly allServices = computed(() => this.allServicesPaged()?.items ?? []);

  readonly activeInviteToken = computed(() => {
    const res: any = this.activeInviteResource.value();
    if (!res) return null;
    return res.token || res.data?.token || null;
  });

  readonly totalWorkersCount = computed(() => this.allWorkersPaged()?.totalCount ?? this.allWorkers().length);
  readonly activeWorkersCount = computed(() => this.allWorkers().filter((w) => w.isActive && w.isApproved).length);
  readonly totalServicesCount = computed(() => this.allServicesPaged()?.totalCount ?? this.allServices().length);

  readonly recentWorkers = computed(() => this.allWorkers().slice(0, 8));

  readonly isLoading = computed(
    () =>
      this.currentServiceResource.isLoading() ||
      this.allWorkersResource.isLoading() ||
      this.pendingWorkersResource.isLoading()
  );

  refreshAll(): void {
    this.refetchTrigger.update((n) => n + 1);
    this.inviteRefetch.update((n) => n + 1);
  }

  refreshInvite(): void {
    this.inviteRefetch.update((n) => n + 1);
  }

  generateInvite(): void {
    this.dashboardService.generateInvite().subscribe({
      next: () => this.refreshInvite(),
    });
  }

  revokeInvite(): void {
    this.dashboardService.revokeInvite().subscribe({
      next: () => this.refreshInvite(),
    });
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