import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { mockProfileUser } from '../data/profile.mock';

@Injectable({
  providedIn: 'root'
})
export class MockProfileService {
  getCurrentUser(id: string): Observable<User> {
    return of(mockProfileUser);
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return of({ ...mockProfileUser, ...userData });
  }

  generateMFA(): Observable<{ qrCode: string }> {
    return of({ qrCode: 'mock-qr-code' });
  }

  verifyMFA(token: string): Observable<boolean> {
    return of(true);
  }
} 