import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonInput,
  IonText,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '@core/auth/auth.service';
import { AuthState } from '@core/auth/auth.state';
import { addIcons } from 'ionicons';
import { lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-set-pin',
  templateUrl: './set-pin.page.html',
  styleUrls: ['./set-pin.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonInput,
    IonText,
    IonButton,
    IonSpinner,
    IonIcon,
  ],
})
export class SetPinPage {
  private readonly _authService = inject(AuthService);
  private readonly _authState = inject(AuthState);
  private readonly _router = inject(Router);

  readonly newPin = signal<string>('');
  readonly confirmPin = signal<string>('');
  readonly showPin = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({ lockClosedOutline, eyeOutline, eyeOffOutline, checkmarkCircleOutline });
  }

  togglePinVisibility(): void {
    this.showPin.update((v) => !v);
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const pin = this.newPin().trim();
    const confirm = this.confirmPin().trim();

    if (!pin || pin.length < 4) {
      this.errorMessage.set('Please enter a 4-digit numeric PIN.');
      return;
    }

    if (pin !== confirm) {
      this.errorMessage.set('PINs do not match. Please verify and try again.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this._authService.setPin(pin).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this._authState.setRequiresPinSetup(false);
          this._router.navigateByUrl('/home');
        } else {
          this.errorMessage.set(res.message || 'Could not set PIN.');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Could not set PIN. Please try again.',
        );
      },
    });
  }
}
