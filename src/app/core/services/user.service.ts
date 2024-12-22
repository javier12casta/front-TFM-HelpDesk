import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse, User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.baseAPI}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUser(id: string): Observable<User> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`, { 
      withCredentials: true 
    }).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, userData, { 
      withCredentials: true 
    }).pipe(
      map(response => response.data)
    );
  }

  generateMFA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mfa/generate`, {}, { 
      withCredentials: true 
    });
  }

  verifyMFA(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mfa/verify`, { token }, { 
      withCredentials: true 
    });
  }

  validateMFA(token: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mfa/validate`, { token, email }, { 
      withCredentials: true 
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

} 