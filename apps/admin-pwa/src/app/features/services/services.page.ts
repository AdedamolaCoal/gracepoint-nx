import { Component, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,

  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonBadge,
  IonSpinner,
  IonModal,
  IonInput,
  IonDatetime,
  IonDatetimeButton,
  IonPopover,
  IonNote,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  qrCodeOutline,
  closeCircleOutline,
  calendarOutline,
  timeOutline,
  locationOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  sparklesOutline,
  navigateOutline,
} from 'ionicons/icons';
import { ServicesStore } from './services.store';
import { QrCodeBrandedComponent } from '@gracepoint/shared';

import { ServiceEventService } from '@core/services/service-event.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { environment } from '@env/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,

    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonChip,
    IonBadge,
    IonSpinner,
    IonModal,
    IonInput,
    IonDatetime,
    IonDatetimeButton,
    IonPopover,
    IonNote,
    IonLabel,
    QrCodeBrandedComponent,
  ],
  templateUrl: './services.page.html',
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  protected readonly store = inject(ServicesStore);
  private readonly serviceEventService = inject(ServiceEventService);

  // Create form state
  readonly showCreateModal = signal(false);
  readonly name = signal('Sunday Service');
  readonly serviceDate = signal(new Date().toISOString());
  readonly scheduledStart = signal('08:00');
  readonly scheduledEnd = signal('12:00');
  readonly lateAfterMinutes = signal(20);
  readonly churchLat = signal(0);
  readonly churchLng = signal(0);
  readonly geoRadiusMeters = signal(150);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);

  // QR modal state
  readonly qrModalService = signal<ServiceEventSummary | null>(null);
  protected readonly clockInUrl = computed(() => {
    const service = this.qrModalService();
    return service ? `${environment.workerBaseUrl}/scan?token=${service.qrToken}` : '';
  });

  constructor() {
    addIcons({
      addOutline,
      qrCodeOutline,
      closeCircleOutline,
      calendarOutline,
      timeOutline,
      locationOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      sparklesOutline,
      navigateOutline,
    });
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.showCreateModal.set(true);
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.churchLat.set(position.coords.latitude);
          this.churchLng.set(position.coords.longitude);
        },
        () => {
          this.formError.set('Could not fetch location automatically. Enter manually.');
        }
      );
    }
  }

  submitCreate(): void {
    if (!this.name() || this.churchLat() === 0) {
      this.formError.set('Name and church location are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set(null);

    this.serviceEventService
      .create({
        name: this.name(),
        serviceDate: this.serviceDate().split('T')[0],
        scheduledStart: `${this.scheduledStart()}:00`,
        scheduledEnd: `${this.scheduledEnd()}:00`,
        lateAfterMinutes: this.lateAfterMinutes(),
        churchLat: this.churchLat(),
        churchLng: this.churchLng(),
        geoRadiusMeters: this.geoRadiusMeters(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showCreateModal.set(false);
          this.store.refresh();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.formError.set(err.error?.message ?? 'Could not create service.');
        },
      });
  }

  closeService(service: ServiceEventSummary): void {
    this.serviceEventService.close(service.id).subscribe({
      next: () => this.store.refresh(),
    });
  }

  showQr(service: ServiceEventSummary): void {
    this.qrModalService.set(service);
  }
}