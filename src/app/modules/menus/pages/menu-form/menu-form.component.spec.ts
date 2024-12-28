import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuFormComponent } from './menu-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../shared/material-imports';

describe('MenuFormComponent', () => {
  let component: MenuFormComponent;
  let fixture: ComponentFixture<MenuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenuFormComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        SharedModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.menuForm).toBeDefined();
    expect(component.menuForm.get('name')).toBeDefined();
    expect(component.menuForm.get('path')).toBeDefined();
    expect(component.menuForm.get('icon')).toBeDefined();
    expect(component.menuForm.get('parentId')).toBeDefined();
  });

  it('should validate required fields', () => {
    const form = component.menuForm;
    expect(form.valid).toBeFalsy();

    form.controls['name'].setValue('Test Menu');
    form.controls['path'].setValue('/test');
    
    expect(form.valid).toBeTruthy();
  });
}); 