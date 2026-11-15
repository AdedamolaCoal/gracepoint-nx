import { Injectable, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { AuthState } from '@core/auth/auth.state';

const FCM_TOKEN_KEY = 'fcm_device_token';

@Injectable({ providedIn: 'root' })
export class FcmService {
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  /**
   * Register device token with backend API (POST /api/workers/me/device)
   */
  registerDeviceToken(token: string, platform: 'web' | 'android' | 'ios' = 'web'): void {
    if (!token || !this.authState.isAuthenticated()) return;

    this.authService.registerDevice(token, platform).subscribe({
      next: () => {
        localStorage.setItem(FCM_TOKEN_KEY, token);
      },
      error: () => {},
    });
  }

  /**
   * Unregister device token from backend API on logout (DELETE /api/workers/me/device/{token})
   */
  unregisterDeviceToken(): void {
    const token = localStorage.getItem(FCM_TOKEN_KEY);
    if (!token) return;

    this.authService.unregisterDevice(token).subscribe({
      next: () => {
        localStorage.removeItem(FCM_TOKEN_KEY);
      },
      error: () => {
        localStorage.removeItem(FCM_TOKEN_KEY);
      },
    });
  }

  /**
   * Initialize Push Notification permissions and retrieve token if Notification API is supported
   */
  async initPushNotifications(): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const storedToken = localStorage.getItem(FCM_TOKEN_KEY);
        if (storedToken && this.authState.isAuthenticated()) {
          this.registerDeviceToken(storedToken, 'web');
        }
      }
    } catch {
      // Notification permission request declined or unsupported
    }
  }
}
