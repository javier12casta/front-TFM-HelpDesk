export interface ReportQueryParams {
  startDate?: string;
  endDate?: string;
  area?: string;
  category?: string;
}

export interface TicketStats {
  totalTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  avgResolutionTime: number;
  resolutionRate: number;
}

export interface AreaStats {
  area: string;
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
  resolutionRate: number;
}

export interface CategoryStats {
  _id: string;
  categoryName?: string;
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
} 