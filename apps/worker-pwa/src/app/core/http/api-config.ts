import { environment } from "@env/environment";

export const BASE_URL = `${environment.baseUrl}/api`;

export const API = {
  workerLogin: `${BASE_URL}/auth/worker/login`,
  refresh: `${BASE_URL}/auth/refresh`,
  logout: `${BASE_URL}/auth/logout`,
  clockIn: `${BASE_URL}/attendance/clock-in`,
  currentServiceEvent: `${BASE_URL}/service-events/current`,
  workerMe: `${BASE_URL}/workers/me`,
  setPin: `${BASE_URL}/workers/me/set-pin`,
  changePin: `${BASE_URL}/workers/me/change-pin`,
  registerDevice: `${BASE_URL}/workers/me/device`,
  register: `${BASE_URL}/auth/register`,
  units: `${BASE_URL}/units`,
  unregisterDevice: (token: string) =>
    `${BASE_URL}/workers/me/device/${encodeURIComponent(token)}`,
  attendanceHistory: (workerId: string) => `${BASE_URL}/attendance/history`,
} as const;
