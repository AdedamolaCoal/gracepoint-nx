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
  workerHistory: (workerId: string) =>
    `${API_BASE}/admin/reports/worker/${workerId}`,
  pendingWorkers: `${API_BASE}/admin/workers/pending-approval`,
  workers: `${API_BASE}/admin/workers`,
  workersImport: `${API_BASE}/admin/workers/import`,
  workersImportTemplate: `${API_BASE}/admin/workers/import/template`,
  units: `${API_BASE}/units`,
  unitsCreate: `${API_BASE}/admin/units`,
  registrationInviteGenerate: `${API_BASE}/admin/registration-invites/generate`,
  registrationInviteRevoke: `${API_BASE}/admin/registration-invites/revoke`,
  registrationInviteActive: `${API_BASE}/admin/registration-invites/active`,
  adminUsers: `${API_BASE}/admin/admin-users`,
  changeOwnPassword: `${API_BASE}/admin/admin-users/me/change-password`,
} as const;
