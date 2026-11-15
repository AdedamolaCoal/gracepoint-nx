import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { AdminUserSummary } from "@core/models/admin-session.model";
import { Unit } from "@core/models/units.model";
import { AdminUsersService } from "./admin-users.service";
import { ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class AdminUsersStore {
  private readonly service = inject(AdminUsersService);
  private readonly refetch = signal(0);

  private readonly adminsResource = rxResource({
    params: () => this.refetch(),
    stream: () => this.service.getAdminSummary(),
  });

  private readonly unitsResource = rxResource({
    params: () => this.refetch(),
    stream: () => this.service.getUnits(),
  });

  readonly admins = computed(() => ensureArray<AdminUserSummary>(this.adminsResource.value()));
  readonly units = computed(() => ensureArray<Unit>(this.unitsResource.value()));
  readonly isLoadingAdmins = computed(() => this.adminsResource.isLoading());

  refreshAdmins(): void {
    this.refetch.update((n) => n + 1);
  }
}
