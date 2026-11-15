import { Component, inject, signal } from "@angular/core";
import {
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonBadge,
  IonIcon,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personAddOutline, shieldCheckmarkOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";
import { AdminUsersStore } from "./admin-users.store";
import { AdminUsersService } from "./admin-users.service";
import { AdminRole } from "@core/models/admin-session.model";
import { extractErrorMessage } from "@gracepoint/shared";

@Component({
  selector: "app-admin-users",
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonBadge,
    IonIcon,
  ],
  templateUrl: "./admin-users.page.html",
  styleUrl: "./admin-users.page.scss",
})
export class AdminUsersPage {
  protected readonly store = inject(AdminUsersStore);
  private readonly service = inject(AdminUsersService);

  readonly newName = signal("");
  readonly newEmail = signal("");
  readonly newPassword = signal("");
  readonly showPassword = signal(false);
  readonly newRole = signal<AdminRole>("Admin");
  readonly newUnitId = signal<string | null>(null);
  readonly isCreating = signal(false);
  readonly formMessage = signal<string | null>(null);
  readonly isError = signal(false);

  constructor() {
    addIcons({ personAddOutline, shieldCheckmarkOutline, eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  submitCreateAdmin(): void {
    if (!this.newName() || !this.newEmail() || !this.newPassword()) {
      this.isError.set(true);
      this.formMessage.set("Name, email, and password are required.");
      return;
    }

    if (this.newRole() === "UnitLeader" && !this.newUnitId()) {
      this.isError.set(true);
      this.formMessage.set("UnitLeader accounts must be assigned a department.");
      return;
    }

    this.isCreating.set(true);
    this.formMessage.set(null);

    this.service
      .createAdminUser({
        name: this.newName(),
        email: this.newEmail(),
        password: this.newPassword(),
        role: this.newRole(),
        unitId: this.newUnitId() || null,
      })
      .subscribe({
        next: (res) => {
          this.isCreating.set(false);
          this.isError.set(false);
          this.formMessage.set(res.message || "Admin account created successfully.");
          this.newName.set("");
          this.newEmail.set("");
          this.newPassword.set("");
          this.newUnitId.set(null);
          this.store.refreshAdmins();
        },
        error: (err) => {
          this.isCreating.set(false);
          this.isError.set(true);
          this.formMessage.set(extractErrorMessage(err, "Could not create admin account."));
        },
      });
  }
}
