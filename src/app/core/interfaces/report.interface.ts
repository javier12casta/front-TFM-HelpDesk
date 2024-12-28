export interface TicketStats {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
  averageResolutionTime: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsResolved: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
}

export interface CategoryDistribution {
  categoryId: string;
  categoryName: string;
  count: number;
  percentage: number;
}

export interface PriorityDistribution {
  priority: string;
  count: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  status?: string;
}

export interface ReportQueryParams {
  startDate: string;
  endDate: string;
  agentId?: string;
  groupBy?: 'day' | 'week' | 'month';
} 