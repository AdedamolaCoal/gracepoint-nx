import { Config } from "@gracepoint/shared";
import { FIREBASE_CONFIG } from "@core/config/firebase.config";

export const environment: Config = {
  production: true,
  baseUrl: "https://gracepoint-worker-attendance.onrender.com",
  firebase: FIREBASE_CONFIG,
};
