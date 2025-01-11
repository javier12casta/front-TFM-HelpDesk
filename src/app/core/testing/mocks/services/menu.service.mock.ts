import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Menu } from '../../../interfaces/menu.interface';
import { mockMenus, mockMenu } from '../data/menus.mock';

@Injectable({
  providedIn: 'root'
})
export class MockMenuService {
  getAllMenus(): Observable<Menu[]> {
    return of(mockMenus);
  }

  getMenuById(id: string): Observable<Menu> {
    return of(mockMenu);
  }

  createMenu(menu: Menu): Observable<Menu> {
    return of({ ...menu, _id: '999' });
  }

  updateMenu(id: string, menu: Menu): Observable<Menu> {
    return of({ ...menu, _id: id });
  }

  deleteMenu(id: string): Observable<void> {
    return of(void 0);
  }
} 