import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
import { HomeStore } from './home.store';
import { HistoryStore } from '@features/history/history.store';
import { AuthState } from '@core/auth/auth.state';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  calendarOutline,
  timeOutline,
  arrowForwardOutline,
  sparklesOutline,
  chevronForwardOutline,
  locationOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { StatusPillComponent } from '@gracepoint/shared/components/status-pill/status-pill.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    StatusPillComponent,
  ],
})
export class HomePage {
  protected readonly homeStore = inject(HomeStore);
  protected readonly historyStore = inject(HistoryStore);
  protected readonly authState = inject(AuthState);
  private readonly router = inject(Router);

  protected readonly recentEntries = computed(() => this.historyStore.entries().slice(0, 5));
  protected readonly workerName = computed(() => {
    const worker = this.authState.currentWorker();
    return worker?.fullName ? worker.fullName.split(' ')[0] : 'Worker';
  });

  constructor() {
    addIcons({
      qrCodeOutline,
      calendarOutline,
      timeOutline,
      arrowForwardOutline,
      sparklesOutline,
      chevronForwardOutline,
      locationOutline,
      checkmarkCircleOutline,
    });
  }

  /**
   * Refetches latest events and attendance records every time the dashboard view is entered
   */
  ionViewDidEnter(): void {
    this.homeStore.refreshNow();
    this.historyStore.reload();
  }

  selectEvent(id: string): void {
    this.homeStore.selectEvent(id);
  }

  goToScan(eventId?: string): void {
    if (eventId) {
      this.router.navigate(['/scan'], { queryParams: { eventId } });
    } else {
      this.router.navigateByUrl('/scan');
    }
  }

  goToHistory(): void {
    this.router.navigateByUrl('/history');
  }
}
