export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'FlaggedForReview';

export interface AttendanceHistoryEntry {
  serviceEventId: string;
  serviceName: string;
  serviceDate: string;
  status: AttendanceStatus;
}

export interface ClockInRequest {
  qrToken: string;
  latitude: number;
  longitude: number;
  clientClockInTime: string;
}

export interface ClockInResult {
  success: boolean;
  message: string;
  status?: AttendanceStatus;
}
