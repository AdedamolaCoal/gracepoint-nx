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
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { ServicesStore } from './services.store';
import { QrCodeBrandedComponent, PaginationComponent } from '@gracepoint/shared';

import { ServiceEventService } from '@core/services/service-event.service';
import { ServiceEventSummary } from '@core/models/service-event.model';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

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
    PaginationComponent,
  ],
  templateUrl: './services.page.html',
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  protected readonly store = inject(ServicesStore);
  private readonly serviceEventService = inject(ServiceEventService);

  // Form state for Create / Edit
  readonly showCreateModal = signal(false);
  readonly editingEventId = signal<string | null>(null);
  readonly name = signal('Sunday Service');
  readonly serviceDate = signal(new Date().toISOString());
  readonly scheduledStart = signal('08:00');
  readonly scheduledEnd = signal('12:00');
  readonly lateAfterMinutes = signal(30);
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
      createOutline,
      trashOutline,
    });
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.editingEventId.set(null);
    this.name.set('Sunday Service');
    this.serviceDate.set(new Date().toISOString());
    this.scheduledStart.set('08:00');
    this.scheduledEnd.set('12:00');
    this.lateAfterMinutes.set(30);
    this.geoRadiusMeters.set(150);
    this.showCreateModal.set(true);
  }

  openEditModal(service: any): void {
    this.formError.set(null);
    this.editingEventId.set(service.id);
    this.name.set(service.name || '');
    this.serviceDate.set(service.serviceDate || new Date().toISOString());

    // Format start/end time if available
    const startTimeStr = service.clockInWindowStart
      ? service.clockInWindowStart.includes('T')
        ? service.clockInWindowStart.split('T')[1].substring(0, 5)
        : service.clockInWindowStart.substring(0, 5)
      : '08:00';
    const endTimeStr = service.clockInWindowEnd
      ? service.clockInWindowEnd.includes('T')
        ? service.clockInWindowEnd.split('T')[1].substring(0, 5)
        : service.clockInWindowEnd.substring(0, 5)
      : '12:00';

    this.scheduledStart.set(startTimeStr);
    this.scheduledEnd.set(endTimeStr);
    this.lateAfterMinutes.set(service.lateAfterMinutes || 30);
    this.churchLat.set(service.churchLat || 0);
    this.churchLng.set(service.churchLng || 0);
    this.geoRadiusMeters.set(service.geoRadiusMeters || 150);

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

  submitCreateOrEdit(): void {
    if (!this.name()) {
      this.formError.set('Name is required.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set(null);

    const payload = {
      name: this.name(),
      serviceDate: this.serviceDate().split('T')[0],
      scheduledStart: this.scheduledStart().includes(':')
        ? this.scheduledStart().length === 5 ? `${this.scheduledStart()}:00` : this.scheduledStart()
        : `${this.scheduledStart()}:00:00`,
      scheduledEnd: this.scheduledEnd().includes(':')
        ? this.scheduledEnd().length === 5 ? `${this.scheduledEnd()}:00` : this.scheduledEnd()
        : `${this.scheduledEnd()}:00:00`,
      lateAfterMinutes: this.lateAfterMinutes(),
      churchLat: this.churchLat(),
      churchLng: this.churchLng(),
      geoRadiusMeters: this.geoRadiusMeters(),
    };

    const eventId = this.editingEventId();
    const action$: Observable<any> = eventId
      ? this.serviceEventService.update(eventId, payload)
      : this.serviceEventService.create(payload);

    action$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.store.refresh();
      },
      error: (err: any) => {
        this.isSubmitting.set(false);
        this.formError.set(err?.error?.message ?? 'Could not save service event.');
      },
    });
  }

  deleteService(service: ServiceEventSummary): void {
    if (confirm(`Are you sure you want to delete "${service.name}"? This action will also delete all attendance records for this event.`)) {
      this.serviceEventService.delete(service.id).subscribe({
        next: () => this.store.refresh(),
        error: (err: any) => alert(err?.error?.message ?? 'Could not delete service event.'),
      });
    }
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