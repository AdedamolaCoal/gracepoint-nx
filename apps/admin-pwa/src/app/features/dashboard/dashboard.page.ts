import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonBadge,
} from '@ionic/angular/standalone';
import { DashboardStore } from './dashboard.store';
import { StatCardComponent } from '@gracepoint/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonSpinner,
    IonBadge,
    StatCardComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  protected readonly store = inject(DashboardStore);
}