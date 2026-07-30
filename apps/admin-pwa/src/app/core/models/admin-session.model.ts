export type AdminRole = 'SuperAdmin' | 'Admin' | 'UnitLeader';

export interface AdminSession {
  id: string;
  name: string;
  role: AdminRole;
  unitId: string | null;
}