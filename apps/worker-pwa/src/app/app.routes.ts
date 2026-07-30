import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/auth/auth-guard';
import { AuthLayoutComponent } from '@gracepoint/shared';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canMatch: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () => import('@features/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('@features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'scan',
        loadComponent: () => import('@features/scan/scan.page').then((m) => m.ScanPage),
      },
      {
        path: 'history',
        loadComponent: () => import('@features/history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
