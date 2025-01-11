import { TicketStats, AreaStats, CategoryStats } from '../../../interfaces/report.interface';

export const mockTicketStats: TicketStats = {
  totalTickets: 100,
  resolvedTickets: 70,
  pendingTickets: 20,
  inProgressTickets: 10,
  avgResolutionTime: 24.5,
  resolutionRate: 0.7
};

export const mockAreaStats: AreaStats[] = [
  {
    area: 'IT',
    total: 50,
    resolved: 35,
    pending: 10,
    inProgress: 5,
    resolutionRate: 0.7
  },
  {
    area: 'HR',
    total: 30,
    resolved: 25,
    pending: 3,
    inProgress: 2,
    resolutionRate: 0.83
  }
];

export const mockCategoryStats: CategoryStats[] = [
  {
    _id: '1',
    categoryName: 'Hardware',
    total: 40,
    resolved: 30,
    pending: 5,
    inProgress: 5
  },
  {
    _id: '2',
    categoryName: 'Software',
    total: 60,
    resolved: 40,
    pending: 10,
    inProgress: 10
  }
]; 