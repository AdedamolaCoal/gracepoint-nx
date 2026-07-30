import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AttendanceService } from '@core/services/attendance.service';
import { ClockInResult } from '@core/models/attendance.model';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Geolocation } from '@capacitor/geolocation';
import { OfflineQueueService } from '@core/offline/offline-queue.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    IonText,
    IonSpinner,
  ],
})
export class ScanPage {
  private readonly attendanceService = inject(AttendanceService);
  private readonly _offlineQueue = inject(OfflineQueueService);

  readonly state = signal<ScanState>('idle');
  readonly result = signal<ClockInResult | null>(null);
  readonly errorMessage = signal<string | null>(null);

  async startScan(): Promise<void> {
    this.errorMessage.set(null);
    this.result.set(null);

    const permission = await BarcodeScanner.requestPermissions();
    if (permission.camera !== 'granted') {
      this.errorMessage.set('Camera permission is required to scan the QR code.');
      return;
    }

    this.state.set('scanning');

    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length === 0) {
        this.state.set('idle');
        return;
      }

      const token = this.extractToken(barcodes[0].rawValue || '');
      if (!token) {
        this.errorMessage.set('This QR code is not a valid clock-in code.');
        this.state.set('idle');
        return;
      }

      await this.submitClockIn(token);
    } catch {
      this.errorMessage.set('Scan cancelled or failed.');
      this.state.set('idle');
    }
  }

  reset(): void {
    this.state.set('idle');
    this.result.set(null);
    this.errorMessage.set(null);
  }

  private extractToken(rawValue: string): string | null {
    try {
      return new URL(rawValue).searchParams.get('token');
    } catch {
      return null; // not a URL - not a token we recognize
    }
  }

  private async submitClockIn(token: string): Promise<void> {
    this.state.set('locating');

    let position;
    try {
      position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
    } catch {
      this.errorMessage.set('Could not get your location. Enable location services and try again.');
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
        await this._offlineQueue.enqueue(request);
        this.result.set({
          success: true,
          message:
            "You're offline. Clock-in saved, and will sync automatically when you're back online.",
        });
        this.state.set('result');
        this.errorMessage.set(err?.error?.message ?? 'Could not check in.');
        this.state.set('idle');
      },
    });
  }
}
