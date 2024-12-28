import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { MenuService } from '../../../../core/services/menu.service';
import { Menu } from '../../../../core/interfaces/menu.interface';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule]
})
export class MenuListComponent implements OnInit {
  menus: Menu[] = [];
  displayedColumns: string[] = ['name', 'path', 'icon', 'parentId', 'actions'];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getAllMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  deleteMenu(id: string) {
    if (confirm('¿Está seguro de eliminar este menú?')) {
      this.menuService.deleteMenu(id).subscribe(() => {
        this.loadMenus();
      });
    }
  }
} 