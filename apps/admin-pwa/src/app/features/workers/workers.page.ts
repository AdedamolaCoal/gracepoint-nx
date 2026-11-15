import { Component, inject, signal, computed, ElementRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
  IonAvatar,
  IonSpinner,
  IonModal,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonNote,
  IonLabel,
} from "@ionic/angular/standalone";

import { addIcons } from "ionicons";
import {
  addOutline,
  checkmarkCircleOutline,
  banOutline,
  refreshOutline,
  personOutline,
  callOutline,
  briefcaseOutline,
  peopleOutline,
  cloudUploadOutline,
  documentTextOutline,
  downloadOutline,
  copyOutline,
  checkmarkOutline,
  searchOutline,
  alertCircleOutline,
  closeCircleOutline,
} from "ionicons/icons";
import { WorkersStore } from "./workers.store";
import { WorkerAdminService } from "@core/services/worker-admin.service";
import { WorkersService, WorkerImportResponse } from "./workers.service";
import { WorkerSummary } from "@core/models/worker-summary.model";
import { extractErrorMessage, PaginationComponent } from "@gracepoint/shared";

type StatusFilter = "all" | "pending" | "active" | "inactive";

@Component({
  selector: "app-workers",
  standalone: true,
  imports: [
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
    IonAvatar,
    IonSpinner,
    IonModal,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonNote,
    IonLabel,
    PaginationComponent,
  ],
  templateUrl: "./workers.page.html",
  styleUrl: "./workers.page.scss",
})
export class WorkersPage {
  protected readonly store = inject(WorkersStore);
  private readonly workerAdminService = inject(WorkerAdminService);
  private readonly workersService = inject(WorkersService);

  @ViewChild('csvFileInput') csvFileInput?: ElementRef<HTMLInputElement>;

  readonly statusFilter = signal<StatusFilter>("all");
  readonly searchTerm = signal("");

  readonly filteredWorkers = computed(() => {
    const filter = this.statusFilter();
    const search = this.searchTerm().toLowerCase().trim();

    return this.store.sortedWorkers().filter((w) => {
      const matchesStatus =
        filter === "all"
          ? true
          : filter === "pending"
            ? !w.isApproved
            : filter === "active"
              ? w.isActive && w.isApproved
              : !w.isActive;

      const matchesSearch =
        !search ||
        w.fullName.toLowerCase().includes(search) ||
        (w.unitName && w.unitName.toLowerCase().includes(search)) ||
        w.phoneNumber.includes(search);

      return matchesStatus && matchesSearch;
    });
  });

  // Create form state
  readonly showCreateModal = signal(false);
  readonly newFullName = signal("");
  readonly newPhoneNumber = signal("");
  readonly newUnitId = signal("");
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);

  // Import CSV state
  readonly showImportModal = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly isImporting = signal(false);
  readonly isDownloadingTemplate = signal(false);
  readonly importError = signal<string | null>(null);
  readonly importResult = signal<WorkerImportResponse | null>(null);
  readonly errorSearchTerm = signal("");
  readonly isCopied = signal(false);

  readonly filteredImportErrors = computed(() => {
    const res = this.importResult();
    if (!res || !res.errors) return [];
    const search = this.errorSearchTerm().toLowerCase().trim();
    if (!search) return res.errors;
    return res.errors.filter((e) => e.toLowerCase().includes(search));
  });

  constructor() {
    addIcons({
      addOutline,
      checkmarkCircleOutline,
      banOutline,
      refreshOutline,
      personOutline,
      callOutline,
      briefcaseOutline,
      peopleOutline,
      cloudUploadOutline,
      documentTextOutline,
      downloadOutline,
      copyOutline,
      checkmarkOutline,
      searchOutline,
      alertCircleOutline,
      closeCircleOutline,
    });
  }

  onSearchTermChange(val: string): void {
    this.searchTerm.set(val);
    this.store.resetPage();
  }

  onStatusFilterChange(val: StatusFilter): void {
    this.statusFilter.set(val);
    this.store.resetPage();
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.newFullName.set("");
    this.newPhoneNumber.set("");
    this.newUnitId.set("");
    this.showCreateModal.set(true);
  }

  openImportModal(): void {
    this.importError.set(null);
    this.importResult.set(null);
    this.selectedFile.set(null);
    this.errorSearchTerm.set("");
    this.isCopied.set(false);
    this.showImportModal.set(true);
  }

  resetImport(): void {
    this.selectedFile.set(null);
    this.importResult.set(null);
    this.importError.set(null);
    this.errorSearchTerm.set("");
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  downloadTemplate(): void {
    this.isDownloadingTemplate.set(true);
    this.store.downloadTemplate().subscribe({
      next: (blob) => {
        this.isDownloadingTemplate.set(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workers-import-template.csv';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.isDownloadingTemplate.set(false);
        this.importError.set(extractErrorMessage(err, 'Could not download import template.'));
      },
    });
  }

  submitImport(): void {
    const file = this.selectedFile();
    if (!file) {
      this.importError.set("Please select a CSV file.");
      return;
    }

    this.isImporting.set(true);
    this.importError.set(null);
    this.importResult.set(null);

    this.workersService.importWorkers(file).subscribe({
      next: (res) => {
        this.isImporting.set(false);
        this.importResult.set(res);
        this.store.refresh();
      },
      error: (err) => {
        this.isImporting.set(false);
        this.importError.set(extractErrorMessage(err, 'Could not import workers CSV.'));
      },
    });
  }

  copyErrorsToClipboard(): void {
    const res = this.importResult();
    if (!res || !res.errors || res.errors.length === 0) return;
    const text = res.errors.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2500);
    });
  }

  submitCreate(): void {
    if (!this.newFullName() || !this.newPhoneNumber() || !this.newUnitId()) {
      this.formError.set("All fields are required.");
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set(null);

    this.workerAdminService
      .create({
        fullName: this.newFullName(),
        phoneNumber: this.newPhoneNumber(),
        unitId: this.newUnitId(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.showCreateModal.set(false);
          this.store.refresh();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.formError.set(extractErrorMessage(err, 'Could not add worker.'));
        },
      });
  }

  approve(worker: WorkerSummary): void {
    this.workerAdminService
      .approve(worker.id)
      .subscribe({ next: () => this.store.refresh() });
  }

  deactivate(worker: WorkerSummary): void {
    this.workerAdminService
      .deactivate(worker.id)
      .subscribe({ next: () => this.store.refresh() });
  }

  reactivate(worker: WorkerSummary): void {
    this.workerAdminService
      .reactivate(worker.id)
      .subscribe({ next: () => this.store.refresh() });
  }
}
