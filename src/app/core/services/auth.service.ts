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
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
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
    return this.http.get(`${this.apiUrl}/auth/logout`)
      .pipe(
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    const user = this.getItem('user');
    console.log(user);    
    return !!user;
  }

    // Guardar un elemento en LocalStorage
  setItem(key: string, value: any): void {
    const jsonData = JSON.stringify(value);
    localStorage.setItem(key, jsonData);
  }

  // Recuperar un elemento de LocalStorage
  getItem<T>(key: string): T | null {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  }

  // Eliminar un elemento de LocalStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar todo el LocalStorage
  clear(): void {
    localStorage.clear();
  }

}