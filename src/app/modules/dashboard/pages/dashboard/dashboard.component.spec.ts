import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        SharedModule,
        NgxChartsModule,
        BrowserAnimationsModule
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should render iframe element', () => {
    const compiled = fixture.nativeElement;
    const iframe = compiled.querySelector('iframe');
    expect(iframe).toBeTruthy();
  });

  it('should have correct iframe attributes', () => {
    const compiled = fixture.nativeElement;
    const iframe = compiled.querySelector('iframe');
    
    expect(iframe.getAttribute('title')).toBe('Pruebas_Helpdesk');
    expect(iframe.getAttribute('width')).toBe('1140');
    expect(iframe.getAttribute('height')).toBe('800');
    expect(iframe.getAttribute('frameborder')).toBe('0');
    expect(iframe.getAttribute('allowFullScreen')).toBe('true');
    expect(iframe.getAttribute('src')).toContain('app.powerbi.com/reportEmbed');
  });
});
