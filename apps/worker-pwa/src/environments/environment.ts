import { Config } from "@gracepoint/shared";
import { FIREBASE_CONFIG } from "@core/config/firebase.config";

export const environment: Config = {
  production: false,
  baseUrl: "https://e388-154-118-61-154.ngrok-free.app",
  firebase: FIREBASE_CONFIG,
};
