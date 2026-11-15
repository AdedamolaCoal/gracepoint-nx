export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

/**
 * Shared environment config interface.
 * workerBaseUrl is optional — only used by admin-pwa.
 */
export interface Config {
  production: boolean;
  baseUrl: string;
  workerBaseUrl?: string;
  firebase?: FirebaseConfig;
}
