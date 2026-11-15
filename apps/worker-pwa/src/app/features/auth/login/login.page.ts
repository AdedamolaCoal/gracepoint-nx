import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonInput,
  IonText,
  IonButton,
  IonSpinner,
  IonCheckbox,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from '@core/auth/auth.service';
import { AuthState } from '@core/auth/auth.state';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { extractErrorMessage } from '@gracepoint/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonInput,
    IonText,
    IonButton,
    IonSpinner,
    IonCheckbox,
    IonIcon,
  ],
})
export class LoginPage {
  private readonly _service = inject(AuthService);
  private readonly _state = inject(AuthState);
  private readonly _router = inject(Router);

  readonly phoneNumber = signal<string>('');
  readonly pin = signal<string>('');
  readonly rememberMe = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const phone = this.phoneNumber().trim();
    if (!phone) {
      this.errorMessage.set('Please enter your phone number.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const pinVal = this.pin().trim() ? this.pin().trim() : null;

    this._service.login(phone, pinVal).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        if (!res.success || !res.data) {
          this.errorMessage.set(res.message ?? 'Invalid Phone number or PIN');
          return;
        }

        const data = res.data;
        const requiresPinSetup = Boolean(data['requiresPinSetup']);
        const fullName = (data['fullName'] || data['name'] || '') as string;
        const unitId = (data['unitId'] || '') as string;
        const unitName = (data['unitName'] || '') as string;

        this._state.setSession(data.token, data.refreshToken, {
          id: data['id'] as string,
          fullName,
          unitId,
          unitName,
          requiresPinSetup,
        });

        if (requiresPinSetup) {
          this._router.navigateByUrl('/set-pin');
        } else {
          this._router.navigateByUrl('/home');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          extractErrorMessage(err, 'Invalid Phone number or PIN.'),
        );
      },
    });
  }
}
