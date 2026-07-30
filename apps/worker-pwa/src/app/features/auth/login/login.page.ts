import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
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

    if (!this.phoneNumber() || !this.pin()) {
      this.errorMessage.set('Enter your phone number and pin.');
      return;
    }

    this.isSubmitting.set(true);

    this._service.login(this.phoneNumber(), this.pin()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);

        if (!res.success) {
          this.errorMessage.set(res.message ?? 'Login failed!');
          return;
        }
        const data = res.data;

        if (data) {
          this._state.setSession(data.token, data.refreshToken, {
            id: data.id,
            fullName: data.fullName,
            unitId: data.unitId,
            unitName: data.unitName,
          });
        }

        this._router.navigateByUrl('/home');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Could not reach the server, please try again.',
        );
      },
    });
  }
}
