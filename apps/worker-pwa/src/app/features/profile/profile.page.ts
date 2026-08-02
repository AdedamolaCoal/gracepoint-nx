import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonButton,
  IonInput,
} from "@ionic/angular/standalone";
import { ProfileStore } from "./profile.store";
import { ProfileService } from "./profile.service";
import { AuthService } from "@core/auth/auth.service";
import { AuthState } from "@core/auth/auth.state";
import { FcmService } from "@core/services/fcm.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.css"],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonButton,
    IonInput,
  ],
})
export class ProfilePage {
  protected readonly profileStore = inject(ProfileStore);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);
  private readonly fcmService = inject(FcmService);
  private readonly router = inject(Router);

  readonly showChangePin = signal(false);
  readonly currentPin = signal('');
  readonly newPin = signal('');
  readonly pinMessage = signal<string | null>(null);
  readonly pinError = signal(false);
  readonly isSubmittingPin = signal(false);

  submitPinChange(): void {
    this.isSubmittingPin.set(true);
    this.pinMessage.set(null);

    this.profileService.changePin(this.currentPin(), this.newPin()).subscribe({
      next: (res) => {
        this.isSubmittingPin.set(false);
        this.pinError.set(false);
        this.pinMessage.set(res.message);
        this.currentPin.set('');
        this.newPin.set('');
      },
      error: (err) => {
        this.isSubmittingPin.set(false);
        this.pinError.set(true);
        this.pinMessage.set(err.error?.message ?? 'Could not update PIN.');
      },
    });
  }

  logout(): void {
    this.fcmService.unregisterDeviceToken();
    this.authService.logout().subscribe({ complete: () => {}, error: () => {} });
    this.authState.clearSession();
    this.router.navigateByUrl('/auth/login');
  }
}
