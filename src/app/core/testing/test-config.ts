import { mockNotifications } from './mocks/data/notifications.mock';
import { MockSocketService } from './mocks/services/socket.service.mock';

export const testingConfig = {
  providers: [
    { provide: 'mockNotifications', useValue: mockNotifications },
    { provide: 'MockSocketService', useClass: MockSocketService }
  ]
}; 