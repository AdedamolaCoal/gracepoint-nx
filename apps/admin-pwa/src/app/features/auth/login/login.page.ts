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
  standalone: true,
  imports: [
    FormsModule,
    IonInput,
    IonText,
    IonButton,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})

export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
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

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Enter your email and password.');
      return;
    }

    this.isSubmitting.set(true);

    this.authService.login(this.email(), this.password()).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);

        const data = result.data;
        if (!result.success || !data) {
          this.errorMessage.set(result.message ?? 'Login failed.');
          return;
        }

        this.authState.setSession(data.token, data.refreshToken, {
          id: data.id,
          name: data.name,
          role: data.role,
          unitId: null,
        });

        this.router.navigateByUrl('/app/dashboard');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Could not reach the server. Please try again.');
      },
    });
  }
}
