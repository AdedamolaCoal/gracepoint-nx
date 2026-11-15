export interface CreateServiceEventRequest {
  name: string;
  serviceDate: string; // "yyyy-MM-dd"
  scheduledStart: string; // "HH:mm:ss"
  scheduledEnd: string;
  lateAfterMinutes: number;
  churchLat: number;
  churchLng: number;
  geoRadiusMeters: number;
}
