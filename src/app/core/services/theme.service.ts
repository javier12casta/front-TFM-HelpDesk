import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Recuperar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setDarkMode(savedTheme === 'dark');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDark);
    }
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode.value);
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}
