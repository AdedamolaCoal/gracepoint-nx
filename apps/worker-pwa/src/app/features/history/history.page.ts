import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { HistoryStore } from './history.store';
import { StatusPillComponent } from "@gracepoint/shared/components/status-pill/status-pill.component";

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    StatusPillComponent,
  ],
})
export class HistoryPage {
  protected readonly historyStore = inject(HistoryStore);

  onRefresh(event: CustomEvent): void {
    this.historyStore.reload(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }

  onIonInfinite(event: CustomEvent): void {
    this.historyStore.loadMore(() => {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    });
  }
}