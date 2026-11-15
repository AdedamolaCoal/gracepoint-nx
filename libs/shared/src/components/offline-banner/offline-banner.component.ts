import { Component, inject } from '@angular/core';
import { OfflineQueueService } from '../../offline/offline-queue.service';

@Component({
  selector: 'app-offline-banner',
  templateUrl: './offline-banner.component.html',
  styleUrl: './offline-banner.component.scss',
  standalone: true,
})

export class OfflineBannerComponent {
  protected readonly queue = inject(OfflineQueueService);
}
