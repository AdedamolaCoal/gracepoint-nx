export interface WorkerSession {
  id: string;
  fullName: string;
  unitId?: string;
  unitName?: string;
  requiresPinSetup?: boolean;
}
