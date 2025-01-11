import { mockNotifications } from './mocks/data/notifications.mock';
import { MockSocketService } from './mocks/services/socket.service.mock';
import { MockThemeService } from './mocks/services/theme.service.mock';

export const testingConfig = {
  providers: [
    { provide: 'mockNotifications', useValue: mockNotifications },
    { provide: 'MockSocketService', useClass: MockSocketService },
    { provide: 'MockThemeService', useClass: MockThemeService }
  ]
}; 