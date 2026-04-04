import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render iframe with expected title and Power BI source', () => {
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('title')).toBe('Pruebas_Helpdesk');
    expect(iframe?.getAttribute('src')).toContain('app.powerbi.com/reportEmbed');
    expect(iframe?.getAttribute('frameborder')).toBe('0');
  });

  it('should mark iframe loaded on load handler', fakeAsync(() => {
    component.iframeLoaded = false;
    component.onIframeLoad();
    expect(component.iframeLoaded).toBe(false);
    tick();
    expect(component.iframeLoaded).toBe(true);
    expect(component.iframeError).toBe(false);
  }));

  it('reloadEmbed should bump revision and reset loading flags', () => {
    component.onIframeLoad();
    const prev = component.safeEmbedUrl;
    component.reloadEmbed();
    expect(component.iframeLoaded).toBe(false);
    expect(component.iframeError).toBe(false);
    expect(component.safeEmbedUrl).not.toBe(prev);
  });
});
