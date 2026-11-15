// Models
export type { ServiceEventSummary } from './models/service-event.model';
export type { Config } from './models/config.model';
export type { AttendanceStatus, AttendanceHistoryEntry, ClockInRequest, ClockInResult } from './models/attendance.model';
export type { ApiResponse } from './models/api-response.model';
export type { PagedResult } from './models/paged-result.model';

// Offline
export { OfflineDatabase } from './offline/offline.db';
export { OfflineQueueService } from './offline/offline-queue.service';


// Auth
export type { AuthApiResult, AuthApiData } from './auth/auth-api.model';
export { AuthLayoutComponent } from './auth/auth-layout/auth-layout.component';
export { AuthLayoutStore } from './auth/auth-layout.store';


// Storage & Utils
export { StorageService } from './storage/storage.service';
export { ensureArray } from './utils/ensure-array.util';
export { extractErrorMessage } from './utils/error-extractor.util';

// Components
export { PaginationComponent } from './components/pagination/pagination.component';
export { StatCardComponent } from './components/stat-card/stat-card.component';
export { QrCodeBrandedComponent } from './components/qr-code-branded/qr-code-branded.component';
export { StatusPillComponent} from './components/status-pill/status-pill.component';
export { OfflineBannerComponent } from './components/offline-banner/offline-banner.component';

