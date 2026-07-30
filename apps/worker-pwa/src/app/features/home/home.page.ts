import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { HomeStore } from './home.store';
import { HistoryStore } from '@features/history/history.store';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { StatusPillComponent } from '@gracepoint/shared/components/status-pill/status-pill.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    StatusPillComponent,
    IonSpinner,
  ],
})
export class HomePage {
  protected readonly homeStore = inject(HomeStore);
  protected readonly historyStore = inject(HistoryStore);
  private readonly router = inject(Router);

  protected readonly lastEntry = computed(() => this.historyStore.entries()[0] ?? null);

  constructor() {
    addIcons({ qrCodeOutline });
  }

  goToScan(): void {
    this.router.navigateByUrl('/scan');
  }
}
