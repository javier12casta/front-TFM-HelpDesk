import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

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

  changeTheme(theme: string) {
    this.setStoredTheme(theme);
    this.setTheme(theme);
  }
} 