import { Component, inject, signal, computed, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  downloadOutline,
  calendarOutline,
  personOutline,
  documentTextOutline,
  sparklesOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { StatCardComponent, StatusPillComponent, PaginationComponent } from '@gracepoint/shared';
import { ReportsStore } from './reports.store';
import { ReportsService } from './reports.service';

type ReportTab = 'service' | 'worker';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    DatePipe,
    IonContent,
    IonSpinner,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonBadge,
    StatCardComponent,
    StatusPillComponent,
    PaginationComponent,
  ],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss',
})
export class ReportsPage {
  protected readonly store = inject(ReportsStore);
  private readonly reportsService = inject(ReportsService);

  readonly activeTab = signal<ReportTab>('service');
  readonly isExporting = signal(false);
  readonly workerSearchTerm = signal('');

  readonly filteredWorkers = computed(() => {
    const term = this.workerSearchTerm().toLowerCase().trim();
    const workers = this.store.allWorkers();
    if (!term) return workers;
    return workers.filter(
      (w) =>
        (w.fullName || '').toLowerCase().includes(term) ||
        (w.unitName || '').toLowerCase().includes(term)
    );
  });

  readonly selectedWorkerName = computed(() => {
    const id = this.store.selectedWorkerId();
    const workers = this.store.allWorkers();
    const worker = workers.find((w) => w.id === id);
    return worker ? worker.fullName : 'Worker';
  });

  constructor() {
    addIcons({
      downloadOutline,
      calendarOutline,
      personOutline,
      documentTextOutline,
      sparklesOutline,
      checkmarkCircleOutline,
    });

    effect(() => {
      const services = this.store.allServices();
      if (services.length > 0 && !this.store.selectedServiceId()) {
        const openService = services.find((s) => s.status === 'Open');
        this.store.selectedServiceId.set(openService ? openService.id : services[0].id);
      }
    });

    effect(() => {
      const workers = this.store.allWorkers();
      if (workers.length > 0 && !this.store.selectedWorkerId()) {
        this.store.setSelectedWorker(workers[0].id);
      }
    });
  }

  onServiceSelected(serviceId: string): void {
    this.store.selectedServiceId.set(serviceId);
  }

  onWorkerSelected(workerId: string): void {
    this.store.setSelectedWorker(workerId);
  }

  exportCsv(): void {
    const serviceId = this.store.selectedServiceId();
    const summary = this.store.serviceAttendance();
    if (!serviceId || !summary) return;

    this.isExporting.set(true);

    this.reportsService.exportServiceAttendance(serviceId).subscribe({
      next: (blob) => {
        this.isExporting.set(false);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance-${summary.serviceName.replace(/\s+/g, '-')}-${summary.serviceDate}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.isExporting.set(false),
    });
  }
}