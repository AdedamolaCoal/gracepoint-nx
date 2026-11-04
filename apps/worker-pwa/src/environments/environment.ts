import { Config } from "@gracepoint/shared";
import { FIREBASE_CONFIG } from "@core/config/firebase.config";

export const environment: Config = {
  production: false,
  baseUrl: "https://crudely-kilogram-snooper.ngrok-free.dev",
  firebase: FIREBASE_CONFIG,
};
