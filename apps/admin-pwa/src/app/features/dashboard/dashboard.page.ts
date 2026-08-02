import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  IonBadge,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline,
  checkmarkCircleOutline,
  timeOutline,
  sparklesOutline,
  calendarOutline,
  addOutline,
  arrowForwardOutline,
  personOutline,
  callOutline,
  qrCodeOutline,
  refreshOutline,
  banOutline,
} from 'ionicons/icons';
import { DashboardStore } from './dashboard.store';
import { StatCardComponent, QrCodeBrandedComponent } from '@gracepoint/shared';
import { environment } from '@env/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IonContent,
    IonSpinner,
    IonBadge,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    StatCardComponent,
    QrCodeBrandedComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  protected readonly store = inject(DashboardStore);

  protected readonly registrationUrl = computed(() => {
    const token = this.store.activeInviteToken();
    return token ? `${environment.workerBaseUrl}/register?token=${token}` : null;
  });

  constructor() {
    addIcons({
      peopleOutline,
      checkmarkCircleOutline,
      timeOutline,
      sparklesOutline,
      calendarOutline,
      addOutline,
      arrowForwardOutline,
      personOutline,
      callOutline,
      qrCodeOutline,
      refreshOutline,
      banOutline,
    });
  }

  approve(workerId: string, event: Event): void {
    event.stopPropagation();
    this.store.approveWorker(workerId);
  }
}