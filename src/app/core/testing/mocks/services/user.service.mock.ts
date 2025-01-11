import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { mockUser } from '../data/user.mock';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  getCurrentUser(id: string): Observable<User> {
    return of(mockUser);
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return of({ ...mockUser, ...userData });
  }

  generateMFA(): Observable<{ qrCode: string }> {
    return of({ qrCode: 'mock-qr-code' });
  }

  verifyMFA(token: string): Observable<boolean> {
    return of(true);
  }
} 