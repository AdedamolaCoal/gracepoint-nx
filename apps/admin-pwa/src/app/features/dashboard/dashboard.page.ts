import { Component, inject } from '@angular/core';
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
} from 'ionicons/icons';
import { DashboardStore } from './dashboard.store';
import { StatCardComponent } from '@gracepoint/shared';

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
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  protected readonly store = inject(DashboardStore);

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
    });
  }

  approve(workerId: string, event: Event): void {
    event.stopPropagation();
    this.store.approveWorker(workerId);
  }
}