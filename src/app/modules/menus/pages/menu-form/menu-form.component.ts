import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { MenuService } from '../../../../core/services/menu.service';
import { Menu } from '../../../../core/interfaces/menu.interface';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class MenuFormComponent implements OnInit {
  menuForm!: FormGroup;
  isEditMode = false;
  menuId!: string;
  parentMenus: Menu[] = [];

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadParentMenus();
    this.menuId = this.route.snapshot.params['id'];
    if (this.menuId) {
      this.isEditMode = true;
      this.loadMenu();
    }
  }

  cancel() {
    this.router.navigate(['/app/menus']);
  }

  createForm() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      path: ['', Validators.required],
      icon: [''],
      parentId: ['']
    });
  }

  loadParentMenus() {
    this.menuService.getAllMenus().subscribe(menus => {
      this.parentMenus = menus;
    });
  }

  loadMenu() {
    this.menuService.getMenuById(this.menuId).subscribe(menu => {
      this.menuForm.patchValue(menu);
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      if (this.isEditMode) {
        this.menuService.updateMenu(this.menuId, this.menuForm.value).subscribe(() => {
          this.router.navigate(['/app/menus']);
        });
      } else {
        this.menuService.createMenu(this.menuForm.value).subscribe(() => {
          this.router.navigate(['/app/menus']);
        });
      }
    }
  }
} 