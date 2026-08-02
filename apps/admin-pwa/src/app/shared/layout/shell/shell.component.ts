import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { AuthState } from '@core/auth/auth.state';
import { AdminRole } from '@core/models/admin-session.model';
import {
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonMenuButton,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  calendarOutline,
  peopleOutline,
  businessOutline,
  barChartOutline,
  settingsOutline,
  logOutOutline,
  personOutline,
} from 'ionicons/icons';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: AdminRole[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonMenuButton,
    IonRouterOutlet,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly authState = inject(AuthState);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentAdmin = this.authState.currentAdmin;

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/app/dashboard', icon: 'home-outline', roles: ['SuperAdmin', 'Admin', 'UnitLeader'] },
    { label: 'Services', path: '/app/services', icon: 'calendar-outline', roles: ['SuperAdmin', 'Admin'] },
    { label: 'Workers', path: '/app/workers', icon: 'people-outline', roles: ['SuperAdmin', 'Admin', 'UnitLeader'] },
    { label: 'Admins & Departments', path: '/app/departments', icon: 'business-outline', roles: ['SuperAdmin', 'Admin'] },
    { label: 'Reports', path: '/app/reports', icon: 'bar-chart-outline', roles: ['SuperAdmin', 'Admin', 'UnitLeader'] },
    { label: 'Settings', path: '/app/settings', icon: 'settings-outline', roles: ['SuperAdmin', 'Admin', 'UnitLeader'] },
  ];

  protected readonly visibleNavItems = computed(() => {
    const role = this.authState.role();
    if (!role) return [];
    return this.allNavItems.filter((item) => item.roles.includes(role));
  });

  constructor() {
    addIcons({
      homeOutline,
      calendarOutline,
      peopleOutline,
      businessOutline,
      barChartOutline,
      settingsOutline,
      logOutOutline,
      personOutline,
    });
  }

  logout(): void {
    this.authService.logout().subscribe({ complete: () => {}, error: () => {} });
    this.authState.clearSession();
    this.router.navigateByUrl('/auth/login');
  }
}