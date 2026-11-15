import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonInput,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { RegisterService } from './register.service';
import { RegisterStore } from './register.store';
import { FormsModule } from '@angular/forms';
import { extractErrorMessage } from '@gracepoint/shared';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonButton,
    IonInput,
    IonSpinner,
    IonText,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegisterService);
  protected readonly unitsStore = inject(RegisterStore);

  private readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly phoneNumber = signal('');
  readonly pin = signal('');
  readonly confirmPin = signal('');
  readonly showNewWorkerFields = signal(false);
  readonly fullName = signal('');
  readonly unitId = signal<string | null>(null);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  submit(): void {
    if (!this.phoneNumber() || !this.pin()) {
      this.errorMessage.set('Phone number and PIN are required.');
      return;
    }

    if (this.pin() !== this.confirmPin()) {
      this.errorMessage.set('PIN and confirmation do not match.');
      return;
    }

    if (this.pin().length < 4) {
      this.errorMessage.set('Choose a PIN with at least 4 digits.');
      return;
    }

    if (this.showNewWorkerFields() && (!this.fullName() || !this.unitId())) {
      this.errorMessage.set('Full name and department are required for new registrations.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.registrationService
      .register({
        token: this.token || undefined,
        phoneNumber: this.phoneNumber(),
        pin: this.pin(),
        fullName: this.showNewWorkerFields() ? this.fullName() : undefined,
        unitId: this.showNewWorkerFields() ? (this.unitId() ?? undefined) : undefined,
      })
      .subscribe({
        next: (result) => {
          this.isSubmitting.set(false);

          if (!result.success) {
            this.errorMessage.set(result.message);
            return;
          }

          this.successMessage.set(result.message);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(err, 'Something went wrong. Please try again.'));
        },
      });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}