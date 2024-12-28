import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Menu, CreateMenuDTO, UpdateMenuDTO } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.baseAPI}/menus`;

  constructor(private http: HttpClient) {}

  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl, { withCredentials: true });
  }

  getMenuById(id: string): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createMenu(menu: CreateMenuDTO): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu, { withCredentials: true });
  }

  updateMenu(id: string, menu: UpdateMenuDTO): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu, { withCredentials: true });
  }

  deleteMenu(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
} 