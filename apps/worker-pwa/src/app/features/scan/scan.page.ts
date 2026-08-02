import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AttendanceService } from '@core/services/attendance.service';
import { ClockInResult } from '@core/models/attendance.model';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Geolocation } from '@capacitor/geolocation';
import { OfflineQueueService } from '@core/offline/offline-queue.service';
import { AuthState } from '@core/auth/auth.state';
import { HttpErrorResponse } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { cameraOutline, qrCodeOutline, closeCircleOutline } from 'ionicons/icons';
import jsQR from 'jsqr';

type ScanState = 'idle' | 'scanning' | 'locating' | 'submitting' | 'result';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ScanPage implements OnDestroy {
  private readonly attendanceService = inject(AttendanceService);
  private readonly _offlineQueue = inject(OfflineQueueService);
  private readonly _authState = inject(AuthState);
  private readonly _router = inject(Router);

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly state = signal<ScanState>('idle');
  readonly result = signal<ClockInResult | null>(null);
  readonly errorMessage = signal<string | null>(null);

  private mediaStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private canvasElement: HTMLCanvasElement = document.createElement('canvas');
  private canvasContext: CanvasRenderingContext2D | null = this.canvasElement.getContext('2d');

  constructor() {
    addIcons({ qrCodeOutline, cameraOutline, closeCircleOutline });
  }

  ngOnDestroy(): void {
    this.stopWebCamera();
  }

  async startScan(): Promise<void> {
    this.errorMessage.set(null);
    this.result.set(null);

    // 1. Try Native Capacitor MLKit BarcodeScanner (iOS / Android Native App)
    try {
      const isSupportedRes = await BarcodeScanner.isSupported().catch(() => ({ supported: false }));
      if (isSupportedRes.supported) {
        const permission = await BarcodeScanner.requestPermissions();
        if (permission.camera === 'granted') {
          this.state.set('scanning');
          const { barcodes } = await BarcodeScanner.scan();
          if (barcodes && barcodes.length > 0) {
            const token = this.extractToken(barcodes[0].rawValue || '');
            if (token) {
              await this.submitClockIn(token);
              return;
            } else {
              this.errorMessage.set('Invalid QR code format.');
              this.state.set('idle');
              return;
            }
          }
          this.state.set('idle');
          return;
        }
      }
    } catch {
      // Fall through to live Web Browser Camera Stream
    }

    // 2. Web Browser PWA Camera Stream Fallback (e.g. iPhone Safari, Chrome via ngrok)
    await this.startWebCamera();
  }

  async startWebCamera(): Promise<void> {
    this.state.set('scanning');
    this.errorMessage.set(null);

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          const video = this.videoElement.nativeElement;
          video.srcObject = this.mediaStream;
          video.setAttribute('playsinline', 'true'); // Required for iOS Safari
          video.play();
          this.scanVideoFrame();
        }
      }, 100);
    } catch (err: any) {
      console.warn('Web camera stream access error:', err);
      this.stopWebCamera();
      // If camera stream permission denied or failed, offer photo capture input
      this.errorMessage.set('Camera access required. Tap below to select or take a photo of the QR code.');
      this.state.set('idle');
    }
  }

  private scanVideoFrame(): void {
    if (this.state() !== 'scanning') {
      return;
    }

    const video = this.videoElement?.nativeElement;
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      this.canvasElement.width = video.videoWidth;
      this.canvasElement.height = video.videoHeight;

      if (this.canvasContext) {
        this.canvasContext.drawImage(video, 0, 0, this.canvasElement.width, this.canvasElement.height);
        const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          const token = this.extractToken(code.data);
          if (token) {
            this.stopWebCamera();
            this.submitClockIn(token);
            return;
          }
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.scanVideoFrame());
  }

  stopWebCamera(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  triggerFileInput(): void {
    this.errorMessage.set(null);
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.state.set('scanning');

    try {
      const bitmap = await createImageBitmap(file);
      this.canvasElement.width = bitmap.width;
      this.canvasElement.height = bitmap.height;

      if (this.canvasContext) {
        this.canvasContext.drawImage(bitmap, 0, 0);
        const imageData = this.canvasContext.getImageData(0, 0, bitmap.width, bitmap.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          const token = this.extractToken(code.data);
          if (token) {
            await this.submitClockIn(token);
            return;
          }
        }
      }

      this.errorMessage.set('Could not find a valid QR code in the image. Try again.');
      this.state.set('idle');
    } catch {
      this.errorMessage.set('Could not read image file.');
      this.state.set('idle');
    } finally {
      input.value = '';
    }
  }

  reset(): void {
    this.stopWebCamera();
    this.state.set('idle');
    this.result.set(null);
    this.errorMessage.set(null);
  }

  private extractToken(rawValue: string): string | null {
    if (!rawValue) return null;
    const trimmed = rawValue.trim();
    if (!trimmed) return null;

    // 1. URL search param 'token'
    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const url = new URL(trimmed);
        const token = url.searchParams.get('token');
        if (token) return token;
      }
    } catch {
      // Ignore URL parse error
    }

    // 2. JSON string containing token or qrToken
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        if (parsed.qrToken) return parsed.qrToken;
        if (parsed.token) return parsed.token;
      }
    } catch {
      // Not JSON
    }

    // 3. Raw token string fallback
    return trimmed;
  }

  private async submitClockIn(token: string): Promise<void> {
    this.state.set('locating');

    let position;
    try {
      position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
    } catch {
      this.errorMessage.set('Could not get location. Please enable location services and try again.');
      this.state.set('idle');
      return;
    }

    this.state.set('submitting');

    const request = {
      qrToken: token,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      clientClockInTime: new Date().toISOString(),
    };

    this.attendanceService.clockIn(request).subscribe({
      next: (result) => {
        this.result.set(result);
        this.state.set('result');
      },
      error: async (err: HttpErrorResponse) => {
        const msg = err?.error?.message ?? '';
        if (err?.status === 400 && (msg.toLowerCase().includes('pin') || msg.toLowerCase().includes('set your pin'))) {
          this._authState.setRequiresPinSetup(true);
          this._router.navigateByUrl('/set-pin');
          return;
        }

        await this._offlineQueue.enqueue(request);
        this.result.set({
          success: true,
          message:
            "You're offline. Clock-in saved, and will sync automatically when you're back online.",
        });
        this.state.set('result');
        this.errorMessage.set(msg || 'Could not check in.');
        this.state.set('idle');
      },
    });
  }
}
