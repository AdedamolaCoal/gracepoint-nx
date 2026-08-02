/**
 * Shared ServiceEventSummary — used by both admin-pwa and worker-pwa.
 * qrToken is optional because the worker app doesn't receive it from the API.
 */
export interface ServiceEventSummary {
  id: string;
  name: string;
  serviceDate: string;
  clockInWindowStart: string;
  clockInWindowEnd: string;
  lateAfter?: string;
  qrToken?: string;
  status: 'Scheduled' | 'Open' | 'Closed';
}
