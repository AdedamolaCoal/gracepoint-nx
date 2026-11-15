import { Component, input, output, computed } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <div class="app-pagination">
      <div class="app-pagination__info">
        <span>Showing <strong>{{ startItem() }}</strong>–<strong>{{ endItem() }}</strong> of <strong>{{ totalCount() }}</strong></span>
      </div>

      <div class="app-pagination__controls">
        <ion-button
          fill="outline"
          size="small"
          class="app-pagination__btn"
          [disabled]="!hasPreviousPage()"
          (click)="goToPage(page() - 1)"
          title="Previous Page"
        >
          <ion-icon name="chevron-back-outline" slot="icon-only"></ion-icon>
        </ion-button>

        <span class="app-pagination__page-indicator">
          Page <strong>{{ page() }}</strong> of <strong>{{ totalPages() || 1 }}</strong>
        </span>

        <ion-button
          fill="outline"
          size="small"
          class="app-pagination__btn"
          [disabled]="!hasNextPage()"
          (click)="goToPage(page() + 1)"
          title="Next Page"
        >
          <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .app-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.6rem;
      padding: 1.6rem 0;
      margin-top: 1.6rem;
      border-top: 0.1rem solid var(--app-border-subtle, #f1f5f9);
      flex-wrap: wrap;

      &__info {
        font-size: 1.3rem;
        color: var(--app-text-sub, #64748b);
        font-weight: 500;

        strong {
          color: var(--app-text-main, #0f172a);
          font-weight: 700;
        }
      }

      &__controls {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      &__btn {
        --border-radius: var(--app-radius-sm, 0.8rem);
        --border-color: var(--app-border, #cbd5e1);
        --color: var(--app-text-main, #0f172a);
        --padding-start: 0.8rem;
        --padding-end: 0.8rem;
        margin: 0;
        height: 3.6rem;

        &[disabled] {
          opacity: 0.4;
        }

        ion-icon {
          font-size: 1.6rem;
        }
      }

      &__page-indicator {
        font-size: 1.3rem;
        font-weight: 500;
        color: var(--app-text-sub, #475569);
        padding: 0 0.6rem;

        strong {
          color: var(--app-text-main, #0f172a);
          font-weight: 700;
        }
      }
    }
  `],
})
export class PaginationComponent {
  readonly page = input<number>(1);
  readonly pageSize = input<number>(30);
  readonly totalCount = input<number>(0);
  readonly totalPages = input<number>(1);
  readonly hasNextPage = input<boolean>(false);
  readonly hasPreviousPage = input<boolean>(false);

  readonly pageChange = output<number>();

  readonly startItem = computed(() => {
    if (this.totalCount() === 0) return 0;
    return (this.page() - 1) * this.pageSize() + 1;
  });

  readonly endItem = computed(() => {
    return Math.min(this.page() * this.pageSize(), this.totalCount());
  });

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }

  goToPage(targetPage: number): void {
    if (targetPage < 1) return;
    this.pageChange.emit(targetPage);
  }
}
