import { Component, inject, signal, computed } from "@angular/core";
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
  IonSelect,
  IonSelectOption,
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
} from "ionicons/icons";
import { WorkersStore } from "./workers.store";
import { WorkerAdminService } from "@core/services/worker-admin.service";
import { WorkerSummary } from "@core/models/worker-summary.model";

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
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonSearchbar,
    IonNote,
    IonLabel,
  ],

  templateUrl: "./workers.page.html",
  styleUrl: "./workers.page.scss",
})
export class WorkersPage {
  protected readonly store = inject(WorkersStore);
  private readonly workerAdminService = inject(WorkerAdminService);

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
    });
  }

  openCreateModal(): void {
    this.formError.set(null);
    this.newFullName.set("");
    this.newPhoneNumber.set("");
    this.newUnitId.set("");
    this.showCreateModal.set(true);
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
          this.formError.set(err.error?.message ?? "Could not add worker.");
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
