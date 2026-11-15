export interface RegisterWorkerRequest {
  token?: string;
  phoneNumber: string;
  pin: string;
  fullName?: string;
  unitId?: string;
}

export interface RegisterWorkerResult {
  success: boolean;
  message: string;
  wasClaim: boolean;
}