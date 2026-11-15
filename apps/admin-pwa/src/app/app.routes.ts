import { Routes } from '@angular/router';
import { guestGuard, roleGuard } from '@core/auth/auth.guard';
import { AuthLayoutComponent } from '@gracepoint/shared';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canMatch: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'app',
    canMatch: [roleGuard(['SuperAdmin', 'Admin', 'UnitLeader'])],
    loadComponent: () => import('./shared/layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'services',
        canMatch: [roleGuard(['SuperAdmin', 'Admin'])],
        loadComponent: () => import('./features/services/services.page').then((m) => m.ServicesPage),
      },
      {
        path: 'workers',
        loadComponent: () => import('./features/workers/workers.page').then((m) => m.WorkersPage),
      },
      {
        path: 'departments',
        canMatch: [roleGuard(['SuperAdmin', 'Admin'])],
        loadComponent: () => import('./features/departments/departments.page').then((m) => m.DepartmentsPage),
      },
      {
        path: 'admin-users',
        redirectTo: 'departments',
        pathMatch: 'full',
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.page').then((m) => m.ReportsPage),
      },
      {
        path: 'settings',
        canMatch: [roleGuard(['SuperAdmin', 'Admin', 'UnitLeader'])],
        loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
