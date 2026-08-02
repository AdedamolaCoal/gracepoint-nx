import { Component, inject, signal, computed } from "@angular/core";
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonInput,
  IonButton,
  IonSpinner,
  IonBadge,
  IonIcon,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addOutline,
  businessOutline,
  personAddOutline,
  shieldCheckmarkOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import { DepartmentsStore } from "./departments.store";
import { DepartmentsService } from "./departments.service";
import { AuthState } from "@core/auth/auth.state";
import { AdminRole } from "@core/models/admin-session.model";
import { extractErrorMessage } from "@gracepoint/shared";

export type AdminsDeptTab = "units" | "admins";

@Component({
  selector: "app-departments",
  standalone: true,
  imports: [
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonInput,
    IonButton,
    IonSpinner,
    IonBadge,
    IonIcon,
  ],
  templateUrl: "./departments.page.html",
  styleUrl: "./departments.page.scss",
})
export class DepartmentsPage {
  protected readonly store = inject(DepartmentsStore);
  private readonly service = inject(DepartmentsService);
  private readonly authState = inject(AuthState);

  protected readonly isSuperAdmin = computed(
    () => this.authState.role() === "SuperAdmin"
  );

  readonly activeTab = signal<AdminsDeptTab>("units");

  // Unit form
  readonly newUnitName = signal("");
  readonly isCreatingUnit = signal(false);

  // Admin user form
  readonly newAdminName = signal("");
  readonly newAdminEmail = signal("");
  readonly newAdminPassword = signal("");
  readonly showAdminPassword = signal(false);
  readonly newAdminRole = signal<AdminRole>("Admin");
  readonly newAdminUnitId = signal<string | null>(null);
  readonly isCreatingAdmin = signal(false);
  readonly adminFormMessage = signal<string | null>(null);
  readonly adminFormError = signal(false);

  constructor() {
    addIcons({
      addOutline,
      businessOutline,
      personAddOutline,
      shieldCheckmarkOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  toggleAdminPasswordVisibility(): void {
    this.showAdminPassword.update((val) => !val);
  }

  createUnit(): void {
    if (!this.newUnitName().trim()) return;

    this.isCreatingUnit.set(true);
    this.service.createUnit(this.newUnitName().trim()).subscribe({
      next: () => {
        this.isCreatingUnit.set(false);
        this.newUnitName.set("");
        this.store.refreshUnits();
      },
      error: () => this.isCreatingUnit.set(false),
    });
  }

  submitCreateAdmin(): void {
    if (!this.newAdminName() || !this.newAdminEmail() || !this.newAdminPassword()) {
      this.adminFormError.set(true);
      this.adminFormMessage.set("Name, email, and password are required.");
      return;
    }

    if (this.newAdminRole() === "UnitLeader" && !this.newAdminUnitId()) {
      this.adminFormError.set(true);
      this.adminFormMessage.set("UnitLeader accounts must be assigned a department.");
      return;
    }

    this.isCreatingAdmin.set(true);
    this.adminFormMessage.set(null);

    this.service
      .createAdminUser({
        name: this.newAdminName(),
        email: this.newAdminEmail(),
        password: this.newAdminPassword(),
        role: this.newAdminRole(),
        unitId: this.newAdminUnitId() || null,
      })
      .subscribe({
        next: (res) => {
          this.isCreatingAdmin.set(false);
          this.adminFormError.set(false);
          this.adminFormMessage.set(res.message || "Admin account created successfully.");
          this.newAdminName.set("");
          this.newAdminEmail.set("");
          this.newAdminPassword.set("");
          this.newAdminUnitId.set(null);
          this.store.refreshAdmins();
        },
        error: (err) => {
          this.isCreatingAdmin.set(false);
          this.adminFormError.set(true);
          this.adminFormMessage.set(extractErrorMessage(err, "Could not create admin account."));
        },
      });
  }
}
