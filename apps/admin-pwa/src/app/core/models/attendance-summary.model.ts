export interface AttendanceRecordDetail {
  workerId: string;
  workerName: string;
  unitName: string;
  status: 'Present' | 'Late' | 'Absent' | 'FlaggedForReview';
  clientClockInTime: string;
  distanceFromChurchMeters: number;
}

export interface ServiceAttendanceSummary {
  serviceEventId: string;
  serviceName: string;
  serviceDate: string;
  totalWorkers: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  flaggedCount: number;
  records: AttendanceRecordDetail[];
}