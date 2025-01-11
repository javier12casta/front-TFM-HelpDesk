import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { mockUsers, mockUser } from '../data/users.mock';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  getUsers(): Observable<{ data: User[] }> {
    return of({ data: mockUsers });
  }

  getUserById(id: string): Observable<{ data: User }> {
    return of({ data: mockUser });
  }

  createUser(user: Partial<User>): Observable<User> {
    return of({ ...mockUser, ...user });
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return of({ ...mockUser, ...user, _id: id });
  }

  deleteUser(id: string): Observable<void> {
    return of(void 0);
  }
} 