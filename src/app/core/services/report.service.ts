import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TicketStats,
  AgentPerformance,
  CategoryDistribution,
  PriorityDistribution,
  TimeSeriesData,
  ReportQueryParams
} from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.baseAPI}/reports`;

  constructor(private http: HttpClient) {}

  getTicketStats(params: ReportQueryParams): Observable<TicketStats> {
    const httpParams = this.buildParams(params);
    return this.http.get<TicketStats>(`${this.apiUrl}/tickets/stats`, { params: httpParams, withCredentials: true });
  }

  getAgentPerformance(params: ReportQueryParams): Observable<AgentPerformance> {
    const httpParams = this.buildParams(params);
    return this.http.get<AgentPerformance>(`${this.apiUrl}/agents/performance`, { params: httpParams, withCredentials: true });
  }

  getCategoryDistribution(params: ReportQueryParams): Observable<CategoryDistribution[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<CategoryDistribution[]>(`${this.apiUrl}/categories/distribution`, { params: httpParams, withCredentials: true });
  }

  getPriorityDistribution(params: ReportQueryParams): Observable<PriorityDistribution[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<PriorityDistribution[]>(`${this.apiUrl}/priority/distribution`, { params: httpParams, withCredentials: true     });
  }

  getTimeSeriesData(params: ReportQueryParams): Observable<TimeSeriesData[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<TimeSeriesData[]>(`${this.apiUrl}/timeseries`, { params: httpParams, withCredentials: true });
  }

  private buildParams(params: ReportQueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params.agentId) {
      httpParams = httpParams.set('agentId', params.agentId);
    }
    if (params.groupBy) {
      httpParams = httpParams.set('groupBy', params.groupBy);
    }
    
    return httpParams;
  }
} 