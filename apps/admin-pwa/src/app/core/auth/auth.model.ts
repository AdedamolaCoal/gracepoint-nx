import { AdminRole } from '../models/admin-session.model';
import { AuthApiData, AuthApiResult } from '@gracepoint/shared';

export interface AdminAuthData extends AuthApiData {
  id: string;
  name: string;
  role: AdminRole;
}

export type AdminAuthResult = AuthApiResult<AdminAuthData>;
