import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { StorageService } from "@gracepoint/shared";
import { API } from "@core/http/api-config";
import { WorkerProfile } from "@core/models/worker-profile.model";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

const WORKER_SESSION_KEY = 'worker_session';
const WORKER_PROFILE_KEY = 'worker_profile';

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  getWorkerProfileFromStorage(): WorkerProfile | null {
    try {
      // First check stored worker profile, then fallback to worker session
      const rawProfile = this.storage.get(WORKER_PROFILE_KEY);
      if (rawProfile) {
        return JSON.parse(rawProfile) as WorkerProfile;
      }
      const rawSession = this.storage.get(WORKER_SESSION_KEY);
      if (rawSession) {
        const session = JSON.parse(rawSession);
        return {
          id: session.id || '',
          fullName: session.fullName || session.name || 'Worker',
          phoneNumber: session.phoneNumber || '',
          unitName: session.unitName || session.department || 'Gracepoint Unit',
        };
      }
    } catch {
      // Fallback
    }
    return null;
  }

  getWorkerProfile(): Observable<WorkerProfile | null> {
    return this.http.get<any>(API.workerMe).pipe(
      map((res) => {
        if (!res) return null;
        const profile = res.data !== undefined ? res.data : res;
        if (!profile || typeof profile !== 'object') return null;
        return {
          id: profile.id || '',
          fullName: profile.fullName || profile.name || 'Worker',
          phoneNumber: profile.phoneNumber || '',
          unitName: profile.unitName || profile.department || 'Gracepoint Unit',
        } as WorkerProfile;
      }),
      tap((profile) => {
        if (profile) {
          this.storage.set(WORKER_PROFILE_KEY, JSON.stringify(profile));
        }
      }),
      catchError(() => {
        // Fallback to storage data if HTTP request fails
        return of(this.getWorkerProfileFromStorage());
      })
    );
  }

  changePin(currentPin: string, newPin: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.changePin, {
      currentPin,
      newPin,
    });
  }
}