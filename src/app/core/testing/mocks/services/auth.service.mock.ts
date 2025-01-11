import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private isLoggedIn = true;

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
} 