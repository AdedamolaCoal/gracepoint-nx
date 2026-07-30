import { environment } from "@env/environment";

const API_BASE = `${environment.baseUrl}/api`;

export const API = {
  adminLogin: `${API_BASE}/auth/admin/login`,
  refresh: `${API_BASE}/auth/refresh`,
  logout: `${API_BASE}/auth/logout`,
  currentServiceEvent: `${API_BASE}/admin/service-events/current`,
  serviceEvents: `${API_BASE}/admin/service-events`,
  serviceAttendance: (id: string) => `${API_BASE}/admin/reports/service/${id}`,
  serviceAttendanceExport: (id: string) =>
    `${API_BASE}/admin/reports/service/${id}/export`,
  pendingWorkers: `${API_BASE}/admin/workers/pending-approval`,
  workers: `${API_BASE}/admin/workers`,
  units: `${API_BASE}/units`,
} as const;
