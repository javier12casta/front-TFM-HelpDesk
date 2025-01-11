import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '../../../interfaces/role.interface';
import { mockRoles, mockRole } from '../data/roles.mock';

@Injectable({
  providedIn: 'root'
})
export class MockRoleService {
  getAllRoles(): Observable<Role[]> {
    return of(mockRoles);
  }

  getRoleById(id: string): Observable<Role> {
    return of(mockRole);
  }

  createRole(role: Role): Observable<Role> {
    return of({ ...role, _id: '999' });
  }

  updateRole(id: string, role: Role): Observable<Role> {
    return of({ ...role, _id: id });
  }

  deleteRole(id: string): Observable<void> {
    return of(void 0);
  }
} 