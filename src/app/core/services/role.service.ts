import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, CreateRoleDTO } from '../interfaces/role.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.baseAPI}/roles`;

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, { withCredentials: true });
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createRole(role: CreateRoleDTO): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role, { withCredentials: true });
  }

  updateRole(id: string, role: CreateRoleDTO): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role, { withCredentials: true });
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
} 