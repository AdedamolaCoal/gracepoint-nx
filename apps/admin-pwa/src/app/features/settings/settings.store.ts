import { Injectable, inject, computed, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { Unit } from "@core/models/units.model";
import { AdminUserSummary } from "@core/models/admin-session.model";
import { SettingsService } from "./settings.service";
import { PagedResult, ensureArray } from "@gracepoint/shared";

@Injectable({ providedIn: "root" })
export class SettingsStore {
  private readonly _service = inject(SettingsService);
  private readonly unitsRefetch = signal(0);
  private readonly adminsRefetch = signal(0);
  private readonly inviteRefetch = signal(0);

  private readonly _page = signal(1);
  private readonly _pageSize = signal(30);

  private readonly unitsResource = rxResource({
    params: () => this.unitsRefetch(),
    stream: () => this._service.getUnits(1, 100),
  });

  private readonly adminsResource = rxResource({
    params: () => ({ page: this._page(), pageSize: this._pageSize(), trigger: this.adminsRefetch() }),
    stream: ({ params }) => this._service.getAdminSummary(params.page, params.pageSize),
  });

  private readonly activeInviteResource = rxResource({
    params: () => this.inviteRefetch(),
    stream: () => this._service.getRegistrationInviteActive(),
  });

  readonly units = computed(() => ensureArray<Unit>(this.unitsResource.value()));
  readonly adminsPaged = computed(() => this.adminsResource.value() as PagedResult<AdminUserSummary> | undefined);
  readonly admins = computed(() => this.adminsPaged()?.items ?? []);

  readonly page = computed(() => this.adminsPaged()?.page ?? this._page());
  readonly pageSize = computed(() => this.adminsPaged()?.pageSize ?? this._pageSize());
  readonly totalPages = computed(() => this.adminsPaged()?.totalPages ?? 1);
  readonly totalCount = computed(() => this.adminsPaged()?.totalCount ?? 0);
  readonly hasNextPage = computed(() => this.adminsPaged()?.hasNextPage ?? false);
  readonly hasPreviousPage = computed(() => this.adminsPaged()?.hasPreviousPage ?? false);

  readonly activeInviteToken = computed(() => {
    const res: any = this.activeInviteResource.value();
    if (!res) return null;
    return res.token || res.data?.token || null;
  });

  readonly isLoadingUnits = computed(() => this.unitsResource.isLoading());
  readonly isLoadingAdmins = computed(() => this.adminsResource.isLoading());

  setPage(page: number): void {
    this._page.set(page);
  }

  refreshUnits(): void {
    this.unitsRefetch.update((n) => n + 1);
  }

  refreshAdmins(): void {
    this.adminsRefetch.update((n) => n + 1);
  }

  refreshInvite(): void {
    this.inviteRefetch.update((n) => n + 1);
  }
}
