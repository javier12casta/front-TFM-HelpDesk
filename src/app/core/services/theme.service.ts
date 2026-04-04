import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeManager } from './theme-manager.service';

/**
 * Fachada sobre {@link ThemeManager}: un único origen de verdad para claro/oscuro
 * (`html.dark-theme` + `bankticket-theme` en localStorage).
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private themeManager: ThemeManager) {}

  get darkMode$(): Observable<boolean> {
    return this.themeManager.isDark$;
  }

  setDarkMode(isDark: boolean): void {
    this.themeManager.changeTheme(isDark ? 'dark' : 'light');
  }

  toggleDarkMode(): void {
    const next = this.themeManager.getPreferredTheme() === 'dark' ? 'light' : 'dark';
    this.themeManager.changeTheme(next);
  }

  isDarkMode(): boolean {
    return this.themeManager.isDarkMode();
  }
}
