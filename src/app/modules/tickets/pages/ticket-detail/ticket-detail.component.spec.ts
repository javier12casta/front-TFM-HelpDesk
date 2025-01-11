import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetailComponent } from './ticket-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TicketDetailComponent', () => {
  let component: TicketDetailComponent;
  let fixture: ComponentFixture<TicketDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TicketDetailComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 