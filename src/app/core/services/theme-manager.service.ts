import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LOCAL_STORAGE_KEY = 'bankticket-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeManager {
  private document = inject(DOCUMENT);
  private _isDarkSub = new BehaviorSubject(false);
  isDark$ = this._isDarkSub.asObservable();
  private _window = this.document.defaultView;

  constructor() {
    this.migrateLegacyThemeKey();
    this.setTheme(this.getPreferredTheme());
    
    if (this._window?.matchMedia) {
      this._window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          const storedTheme = this.getStoredTheme();
          if (storedTheme !== 'light' && storedTheme !== 'dark') {
            this.setTheme(this.getPreferredTheme());
          }
        });
    }
  }

  getStoredTheme = () => localStorage.getItem(LOCAL_STORAGE_KEY);

  setStoredTheme = (theme: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  };

  getPreferredTheme = (): 'dark' | 'light' => {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme as 'dark' | 'light';
    }
    return this._window?.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  setTheme = (theme: string) => {
    // Un solo lugar para el modo oscuro (tokens CSS + color-scheme). Evitar body.dark-theme legacy.
    this.document.body.classList.remove('dark-theme');

    if (theme === 'auto' && this._window?.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.document.documentElement.classList.add('dark-theme');
      this._isDarkSub.next(true);
    } else {
      if (theme === 'dark') {
        this.document.documentElement.classList.add('dark-theme');
        this._isDarkSub.next(true);
      } else {
        this.document.documentElement.classList.remove('dark-theme');
        this._isDarkSub.next(false);
      }
    }
  };

  /** Estado actual (p. ej. ThemeService / tests). */
  isDarkMode(): boolean {
    return this._isDarkSub.value;
  }

  /** Migra `localStorage.theme` antiguo a `bankticket-theme`. */
  private migrateLegacyThemeKey(): void {
    if (this.getStoredTheme()) {
      return;
    }
    try {
      const legacy = localStorage.getItem('theme');
      if (legacy === 'dark' || legacy === 'light') {
        this.setStoredTheme(legacy);
      }
    } catch {
      /* storage no disponible (SSR / privado) */
    }
  }

  changeTheme(theme: string) {
    this.setStoredTheme(theme);
    this.setTheme(theme);
  }
} 