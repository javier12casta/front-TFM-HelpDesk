import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private isLoggedIn = true;
  private storage: { [key: string]: any } = {
    user: { id: '123' }
  };

  login(credentials: any): Observable<any> {
    return of({ token: 'mock-token' });
  }

  logout(): Observable<void> {
    if (this.isLoggedIn) {
      this.isLoggedIn = false;
      return of(void 0);
    }
    return throwError(() => new Error('Error al cerrar sesión'));
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getItem(key: string): any {
    return this.storage[key];
  }

  setItem(key: string, value: any): void {
    this.storage[key] = value;
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }
} 