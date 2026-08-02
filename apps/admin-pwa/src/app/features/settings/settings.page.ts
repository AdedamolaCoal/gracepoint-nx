import { Component, inject, signal } from "@angular/core";
import {
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { lockClosedOutline, keyOutline } from "ionicons/icons";
import { SettingsService } from "./settings.service";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: "./settings.page.html",
  styleUrl: "./settings.page.scss",
})
export class SettingsPage {
  private readonly settingsService = inject(SettingsService);

  readonly currentPassword = signal("");
  readonly newPassword = signal("");
  readonly isChangingPassword = signal(false);
  readonly passwordMessage = signal<string | null>(null);
  readonly passwordError = signal(false);

  constructor() {
    addIcons({ lockClosedOutline, keyOutline });
  }

  submitPasswordChange(): void {
    if (!this.currentPassword() || !this.newPassword()) {
      this.passwordError.set(true);
      this.passwordMessage.set("Please enter both current and new passwords.");
      return;
    }

    this.isChangingPassword.set(true);
    this.passwordMessage.set(null);

    this.settingsService
      .changeOwnPassword(this.currentPassword(), this.newPassword())
      .subscribe({
        next: (res) => {
          this.isChangingPassword.set(false);
          this.passwordError.set(false);
          this.passwordMessage.set(res.message || "Password changed successfully.");
          this.currentPassword.set("");
          this.newPassword.set("");
        },
        error: (err) => {
          this.isChangingPassword.set(false);
          this.passwordError.set(true);
          this.passwordMessage.set(
            err.error?.message ?? "Could not update password.",
          );
        },
      });
  }
}
