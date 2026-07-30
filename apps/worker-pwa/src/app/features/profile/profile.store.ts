import { Injectable, computed, inject } from '@angular/core';
import { ProfileService } from './profile.service';
import { AuthState } from '@core/auth/auth.state';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly _service = inject(ProfileService);
  private readonly _authState = inject(AuthState);

  profileResource = rxResource({
    params: () => this._authState.currentWorker()?.id,
    stream: ({ params: workerId }) => {
      if (!workerId) return of(null);

      return this._service.getWorkerProfile();
    },
  });

  readonly profile = computed(() => this.profileResource.value());
  readonly isLoading = computed(() => this.profileResource.isLoading());
}
