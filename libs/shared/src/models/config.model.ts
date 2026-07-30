/**
 * Shared environment config interface.
 * workerBaseUrl is optional — only used by admin-pwa.
 */
export interface Config {
  production: boolean;
  baseUrl: string;
  workerBaseUrl?: string;
}
