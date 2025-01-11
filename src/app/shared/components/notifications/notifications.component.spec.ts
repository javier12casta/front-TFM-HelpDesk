import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { SocketService } from '../../../core/services/socket.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { mockNotifications } from '../../../core/testing/mocks/data/notifications.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Notification } from '../../../core/interfaces/notification.interface';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let socketService: jasmine.SpyObj<SocketService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let notificationsSubject: BehaviorSubject<Notification[]>;

  beforeEach(async () => {
    notificationsSubject = new BehaviorSubject<Notification[]>([]);
    
    socketService = jasmine.createSpyObj('SocketService', ['getNotifications', 'markAsRead', 'clearNotifications']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    socketService.getNotifications.and.returnValue(notificationsSubject);
    
    await TestBed.configureTestingModule({
      imports: [
        NotificationsComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SocketService, useValue: socketService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Notifications handling', () => {
    it('should update notifications and unread count on init', fakeAsync(() => {
      notificationsSubject.next(mockNotifications);
      tick();
      fixture.detectChanges();
      
      expect(component.notifications).toEqual(mockNotifications);
      expect(component.unreadCount).toBe(2); // Based on mock data
    }));

    it('should handle empty notifications', fakeAsync(() => {
      notificationsSubject.next([]);
      tick();
      fixture.detectChanges();
      
      expect(component.notifications).toEqual([]);
      expect(component.unreadCount).toBe(0);
    }));

    it('should mark notification as read and navigate if it has ticketId', () => {
      const notification = mockNotifications[0];
      component.notifications = mockNotifications; // Set notifications first
      
      component.markAsRead(notification);
      
      expect(socketService.markAsRead).toHaveBeenCalledWith(notification.id);
      expect(router.navigate).toHaveBeenCalledWith(['/app/tickets', notification.ticketId]);
    });

    it('should mark notification as read without navigation if no ticketId', () => {
      const notification = mockNotifications[2];
      component.notifications = mockNotifications; // Set notifications first
      
      component.markAsRead(notification);
      
      expect(socketService.markAsRead).toHaveBeenCalledWith(notification.id);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should clear all notifications', () => {
      component.notifications = [...mockNotifications]; // Set notifications first
      component.clearAll();
      expect(socketService.clearNotifications).toHaveBeenCalled();
    });
  });

  describe('Icon handling', () => {
    it('should return correct icon for success type', () => {
      expect(component.getIconForType('success')).toBe('check_circle');
    });

    it('should return correct icon for warning type', () => {
      expect(component.getIconForType('warning')).toBe('warning');
    });

    it('should return correct icon for error type', () => {
      expect(component.getIconForType('error')).toBe('error');
    });

    it('should return info icon for unknown type', () => {
      expect(component.getIconForType('unknown' as any)).toBe('info');
    });
  });

  describe('Lifecycle hooks', () => {
    it('should unsubscribe on destroy', () => {
      component.ngOnInit(); // Ensure subscription is created
      const subscription = component['notificationSubscription'];
      spyOn(subscription!, 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(subscription!.unsubscribe).toHaveBeenCalled();
    });

    it('should handle error in notification subscription', fakeAsync(() => {
      const consoleSpy = spyOn(console, 'error');
      socketService.getNotifications.and.returnValue(
        throwError(() => new Error('Test error'))
      );
      
      component.ngOnInit();
      tick();
      
      expect(consoleSpy).toHaveBeenCalled();
    }));
  });

}); 