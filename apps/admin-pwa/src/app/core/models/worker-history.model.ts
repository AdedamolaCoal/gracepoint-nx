import { AttendanceStatus } from '@gracepoint/shared';

export interface WorkerAttendanceHistoryEntry {
  serviceEventId: string;
  serviceName: string;
  serviceDate: string;
  status: AttendanceStatus;
}