export type AdminRole = 'SuperAdmin' | 'Admin' | 'UnitLeader';

export interface AdminSession {
  id: string;
  name: string;
  role: AdminRole;
  unitId: string | null;
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  unitId: string | null;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  unitId: string | null;
}