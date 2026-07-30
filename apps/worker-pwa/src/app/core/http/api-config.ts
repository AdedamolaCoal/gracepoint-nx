import { environment } from '@env/environment';

export const BASE_URL = environment.baseUrl;

export const API = {
  workerLogin: `${BASE_URL}/api/auth/worker/login`,
  refresh: `${BASE_URL}/api/auth/refresh`,
  logout: `${BASE_URL}/api/auth/logout`,
  clockIn: `${BASE_URL}/api/attendance/clock-in`,
  currentServiceEvent: `${BASE_URL}/api/service-events/current`,
  workerMe: `${BASE_URL}/api/workers/me`,
  changePin: `${BASE_URL}/api/workers/me/change-pin`,
  attendanceHistory: (workerId: string) => `${BASE_URL}/api/admin/reports/worker/${workerId}`,
} as const;
