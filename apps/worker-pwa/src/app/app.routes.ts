import { Routes } from "@angular/router";
import {
  guestGuard,
  pinSetupCompletedGuard,
  pinSetupRequiredGuard,
} from "@core/auth/auth-guard";
import { AuthLayoutComponent } from "@gracepoint/shared";

export const routes: Routes = [
  {
    path: "auth",
    component: AuthLayoutComponent,
    canMatch: [guestGuard],
    children: [
      {
        path: "login",
        loadComponent: () =>
          import("@features/auth/login/login.page").then((m) => m.LoginPage),
      },
      {
        path: "register",
        loadComponent: () =>
          import("@features/auth/register/register.page").then(
            (r) => r.RegisterPage,
          ),
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "login",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  {
    path: "set-pin",
    component: AuthLayoutComponent,
    canMatch: [pinSetupRequiredGuard],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@features/auth/set-pin/set-pin.page").then(
            (m) => m.SetPinPage,
          ),
      },
    ],
  },
  {
    path: "",
    canMatch: [pinSetupCompletedGuard],
    loadComponent: () =>
      import("@features/tabs/tabs.page").then((m) => m.TabsPage),
    children: [
      {
        path: "home",
        loadComponent: () =>
          import("@features/home/home.page").then((m) => m.HomePage),
      },
      {
        path: "scan",
        loadComponent: () =>
          import("@features/scan/scan.page").then((m) => m.ScanPage),
      },
      {
        path: "history",
        loadComponent: () =>
          import("@features/history/history.page").then((m) => m.HistoryPage),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("@features/profile/profile.page").then((m) => m.ProfilePage),
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/auth/login",
  },
];
