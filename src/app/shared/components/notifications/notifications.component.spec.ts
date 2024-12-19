import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { SocketService } from '../../../core/services/socket.service';
import { BehaviorSubject } from 'rxjs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let socketService: jasmine.SpyObj<SocketService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SocketService', ['getNotifications', 'markAsRead', 'clearNotifications']);
    spy.getNotifications.and.returnValue(new BehaviorSubject([]));

    await TestBed.configureTestingModule({
      imports: [
        NotificationsComponent,
        MatBadgeModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SocketService, useValue: spy }
      ]
    }).compileComponents();

    socketService = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update unreadCount when notifications change', () => {
    const mockNotifications = [
      { id: '1', read: false },
      { id: '2', read: true },
      { id: '3', read: false }
    ];

    (socketService.getNotifications as jasmine.Spy).and.returnValue(
      new BehaviorSubject(mockNotifications)
    );

    component.ngOnInit();
    expect(component.unreadCount).toBe(2);
  });
  it('should call markAsRead when notification is clicked', () => {
    const mockNotification = { id: '1', read: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error', timestamp: new Date() };
    component.markAsRead(mockNotification);
    expect(socketService.markAsRead).toHaveBeenCalledWith(mockNotification.id);
  });

  it('should call clearNotifications when clearAll is called', () => {
    component.clearAll();
    expect(socketService.clearNotifications).toHaveBeenCalled();
  });
}); 