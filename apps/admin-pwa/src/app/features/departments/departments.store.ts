import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Unit } from "@core/models/units.model";
import { AdminUserSummary } from "@core/models/admin-session.model";
import { DepartmentsService } from "./departments.service";
import { PagedResult, ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class DepartmentsStore {
  private readonly service = inject(DepartmentsService);
  private readonly unitsRefetch = signal(0);
  private readonly adminsRefetch = signal(0);

  private readonly unitsResource = rxResource({
    params: () => this.unitsRefetch(),
    stream: () => this.service.getUnits(1, 100),
  });

  private readonly adminsResource = rxResource({
    params: () => this.adminsRefetch(),
    stream: () => this.service.getAdminSummary(1, 100),
  });

  readonly units = computed(() => ensureArray<Unit>(this.unitsResource.value()));
  readonly adminsPaged = computed(() => this.adminsResource.value() as PagedResult<AdminUserSummary> | undefined);
  readonly admins = computed(() => {
    const val: any = this.adminsResource.value();
    if (!val) return [];
    if (val.items && Array.isArray(val.items)) return val.items as AdminUserSummary[];
    return ensureArray<AdminUserSummary>(val);
  });

  readonly isLoadingUnits = computed(() => this.unitsResource.isLoading());
  readonly isLoadingAdmins = computed(() => this.adminsResource.isLoading());

  refreshUnits(): void {
    this.unitsRefetch.update((n) => n + 1);
  }

  refreshAdmins(): void {
    this.adminsRefetch.update((n) => n + 1);
  }
}
