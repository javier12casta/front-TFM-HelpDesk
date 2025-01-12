import { TestBed } from '@angular/core/testing';
import { SocketService, Notification } from './socket.service';
import { Socket } from 'socket.io-client';

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: any;
  let mockLocalStorage: any;

  beforeEach(() => {
    mockSocket = {
      on: jasmine.createSpy('on'),
      emit: jasmine.createSpy('emit'),
      disconnect: jasmine.createSpy('disconnect')
    };

    // Mock completo de localStorage
    mockLocalStorage = {
      getItem: jasmine.createSpy('getItem').and.returnValue(JSON.stringify({ id: 'user123' })),
      setItem: jasmine.createSpy('setItem'),
      clear: jasmine.createSpy('clear'),
      removeItem: jasmine.createSpy('removeItem'),
      length: 1,
      key: jasmine.createSpy('key')
    };
    
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    TestBed.configureTestingModule({
      providers: [SocketService]
    });
    service = TestBed.inject(SocketService);
    (service as any).socket = mockSocket;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit events', () => {
    const eventName = 'test-event';
    const data = { message: 'test' };
    service.emit(eventName, data);
    expect(mockSocket.emit).toHaveBeenCalledWith(eventName, data);
  });

  it('should mark notification as read', () => {
    const notificationId = '123';
    service.markAsRead(notificationId);
    expect(mockSocket.emit).toHaveBeenCalledWith('markNotificationAsRead', {
      notificationId,
      userId: 'user123'
    });
  });

  it('should clear notifications', () => {
    service.clearNotifications();
    expect(mockSocket.emit).toHaveBeenCalledWith('clearNotifications');
  });

  it('should disconnect socket', () => {
    service.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should handle ticket events', (done) => {
    const mockNotification = {
      id: '123',
      message: 'Test notification',
      type: 'info',
      timestamp: new Date(),
      read: false
    };

    service.getNotifications().subscribe(notifications => {
      expect(notifications).toBeDefined();
      done();
    });

    // Simulate receiving a ticket event
    (service as any).socket.on.calls.allArgs().forEach(([event, callback]: [string, Function]) => {
      if (event === 'ticketCreated') {
        callback(mockNotification);
      }
    });
  });

  it('should handle stored notifications', (done) => {
    const mockStoredNotifications = [{
      _id: '123',
      message: 'Stored notification',
      type: 'info',
      createdAt: new Date().toISOString(),
      read: false
    }];

    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toEqual(0);
      done();
    });

    // Simulate receiving stored notifications
    (service as any).socket.on.calls.allArgs().forEach(([event, callback]: [string, Function]) => {
      if (event === 'stored-notifications') {
        callback(mockStoredNotifications);
      }
    });
  });
}); 