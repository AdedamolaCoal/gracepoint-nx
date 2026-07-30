import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme-mode';

  readonly mode = signal<ThemeMode>(
    (localStorage.getItem(this.storageKey) as ThemeMode) ?? 'system',
  );

  constructor() {
    effect(() => {
      const mode = this.mode();
      localStorage.setItem(this.storageKey, mode);

      const preferDark = window.matchMedia('(prefers-color-scheme: dark)');
      const shouldBeDark = mode === 'dark' || (mode === 'system' && preferDark.matches);

      document.body.classList.toggle('dark-theme', shouldBeDark);
    });
  }

  setTheme(mode: ThemeMode) {
    this.mode.set(mode);
  }
}
