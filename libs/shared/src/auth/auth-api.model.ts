/**
 * Base auth API response shape shared across admin-pwa and worker-pwa.
 * Each app defines its own session-specific AuthApiData by extending this.
 */
export interface AuthApiData {
  token: string;
  refreshToken: string;
  [key: string]: unknown;
}

export interface AuthApiResult<T extends AuthApiData = AuthApiData> {
  success: boolean;
  message: string;
  data?: T;
}
