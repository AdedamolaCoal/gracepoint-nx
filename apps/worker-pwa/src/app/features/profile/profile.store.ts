import { Injectable, computed, inject } from '@angular/core';
import { ProfileService } from './profile.service';
import { AuthState } from '@core/auth/auth.state';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly profileService = inject(ProfileService);
  private readonly authState = inject(AuthState);

  readonly profileResource = rxResource({
    params: () => this.authState.currentWorker()?.id,
    stream: () => this.profileService.getWorkerProfile(),
  });

  readonly profile = computed(() => {
    // Return API value if available, otherwise read directly from localStorage via StorageService
    return this.profileResource.value() ?? this.profileService.getWorkerProfileFromStorage();
  });

  readonly isLoading = computed(() => {
    // If we have cached storage data, we don't block the UI with a full-screen spinner
    if (this.profileService.getWorkerProfileFromStorage() !== null) {
      return false;
    }
    return this.profileResource.isLoading();
  });
}
