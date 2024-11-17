import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MfaService {

  private apiUrl = environment.baseAPI;

  constructor(private http: HttpClient) {}

  generateMFA(userId: string): Observable<{ secret: string; qrCodeUrl: string }> {
    const body = { userId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ secret: string; qrCodeUrl: string }>(
      `${this.apiUrl}/users/mfa/generate`,
      body,
      { headers }
    );
  }

  verifyAndEnableMFA(userId: string, token: string): Observable<any> {
    const body = { userId, token };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/users/mfa/verify`, body, { headers });
  }

  validateMFA(userId: string, token: string): Observable<any> {
    const body = { userId, token };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/users/mfa/validate`, body, { headers });
  }

}
