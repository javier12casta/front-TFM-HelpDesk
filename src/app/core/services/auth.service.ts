import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  // Ajusta según la respuesta real de tu API
  token?: string;
  user?: any;
  requiresMfa?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseAPI;

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, { withCredentials: true });
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    //console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    const user = this.getItem('user');    
    return !!user;
  }

  isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setItem(key: string, value: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isLocalStorageAvailable()) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // Eliminar un elemento de LocalStorage
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  // Limpiar todo el LocalStorage
  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }

}